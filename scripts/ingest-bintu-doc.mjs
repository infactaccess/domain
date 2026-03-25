import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { XMLParser } from 'fast-xml-parser';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !serviceRoleKey || !openaiApiKey) {
  console.error('Missing one or more required environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiApiKey });
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const sourceArg = process.argv[2] || './knowledge';
const sourcePath = path.resolve(process.cwd(), sourceArg);

if (!fs.existsSync(sourcePath)) {
  console.error(`Could not find knowledge source at ${sourcePath}`);
  process.exit(1);
}

const sourceFiles = collectSourceFiles(sourcePath);

if (sourceFiles.length === 0) {
  console.error(`No supported knowledge files were found at ${sourcePath}`);
  process.exit(1);
}

let totalChunks = 0;

for (const filePath of sourceFiles) {
  const result = await ingestSourceFile(filePath);
  totalChunks += result.chunkCount;
  console.log(`Ingested ${result.chunkCount} chunks from ${result.sourceName} into Ask Bintu knowledge base.`);
}

console.log(`Completed knowledge ingestion for ${sourceFiles.length} file(s) with ${totalChunks} total chunks.`);

async function ingestSourceFile(filePath) {
  const sourceName = path.basename(filePath);
  const extracted = extractSourceText(filePath);
  const sections = buildSections(extracted);
  const chunkRecords = chunkSections(sections);
  const checksum = crypto.createHash('sha256').update(extracted.text).digest('hex');

  if (chunkRecords.length === 0) {
    throw new Error(`No usable content was extracted from ${sourceName}.`);
  }

  const documentTitle =
    extracted.title ||
    extracted.headings[0] ||
    sourceName.replace(/\.[^.]+$/, '');
  const documentSlug = extracted.slug || slugify(documentTitle);
  const documentCategory = extracted.category || 'knowledge_base';

  const { data: documentRecord, error: documentError } = await supabase
    .from('documents')
    .upsert(
      {
        title: documentTitle,
        slug: documentSlug,
        category: documentCategory,
        source_url: extracted.sourceUrl || null,
        source_path: sourceName,
        checksum,
        status: 'ready',
        content_text: extracted.text,
        metadata: {
          ingested_from: sourceName,
          headings: extracted.headings,
          paragraph_count: extracted.paragraphs.length,
          section_count: sections.length,
          ingestion_format: extracted.format,
          tags: extracted.tags,
        },
      },
      { onConflict: 'source_path' }
    )
    .select('id')
    .single();

  if (documentError || !documentRecord) {
    throw new Error(`Failed to upsert document ${sourceName}: ${documentError?.message ?? 'Unknown error'}`);
  }

  const { error: deleteError } = await supabase
    .from('document_chunks')
    .delete()
    .eq('document_id', documentRecord.id);

  if (deleteError) {
    throw new Error(`Failed to clear previous chunks for ${sourceName}: ${deleteError.message}`);
  }

  const embeddings = await Promise.all(
    chunkRecords.map((record) =>
      openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: record.content,
        dimensions: 512,
      })
    )
  );

  const rows = chunkRecords.map((record, index) => ({
    document_id: documentRecord.id,
    chunk_index: index,
    content: record.content,
    metadata: {
      source_path: sourceName,
      heading_hint: record.heading,
      section_label: record.label,
      doc_title: documentTitle,
      doc_category: documentCategory,
    },
    embedding: embeddings[index].data[0].embedding,
  }));

  const { error: chunkError } = await supabase.from('document_chunks').insert(rows);

  if (chunkError) {
    throw new Error(`Failed to insert chunks for ${sourceName}: ${chunkError.message}`);
  }

  return {
    sourceName,
    chunkCount: rows.length,
  };
}

function collectSourceFiles(targetPath) {
  const supportedExtensions = new Set(['.docx', '.md', '.txt']);
  const stats = fs.statSync(targetPath);

  if (stats.isFile()) {
    return supportedExtensions.has(path.extname(targetPath).toLowerCase()) ? [targetPath] : [];
  }

  return fs
    .readdirSync(targetPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(targetPath, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

function extractSourceText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.docx') {
    return {
      ...extractDocxText(filePath),
      format: 'docx',
      title: '',
      slug: '',
      category: '',
      sourceUrl: '',
      tags: [],
    };
  }

  if (ext === '.md' || ext === '.txt') {
    return {
      ...extractTextDocument(filePath),
      format: ext === '.md' ? 'markdown' : 'text',
    };
  }

  console.error(`Unsupported source format: ${ext}`);
  process.exit(1);
}

function extractDocxText(docxPath) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'bintu-docx-'));
  const zipPath = path.join(tempRoot, `${path.basename(docxPath, path.extname(docxPath))}.zip`);
  const extractPath = path.join(tempRoot, 'unzipped');

  fs.copyFileSync(docxPath, zipPath);
  execFileSync(
    'powershell.exe',
    ['-NoProfile', '-Command', `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${extractPath}' -Force`],
    { stdio: 'ignore' }
  );

  const xml = fs.readFileSync(path.join(extractPath, 'word', 'document.xml'), 'utf8');
  fs.rmSync(tempRoot, { recursive: true, force: true });

  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const body = parsed['w:document']?.['w:body']?.['w:p'];
  const paragraphs = Array.isArray(body) ? body : body ? [body] : [];
  const lines = paragraphs.map((paragraph) => flattenText(paragraph).trim()).filter(Boolean);

  return {
    text: lines.join('\n\n'),
    paragraphs: lines,
    headings: lines.filter((line) => line.length <= 40).slice(0, 6),
  };
}

function extractTextDocument(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { body, frontmatter } = parseFrontmatter(raw);
  const normalizedBody = body.replace(/\r\n/g, '\n').trim();
  const paragraphs = normalizedBody
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
  const headings = normalizedBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, '').trim());

  return {
    text: normalizedBody,
    paragraphs,
    headings,
    title: frontmatter.title || headings[0] || '',
    slug: frontmatter.slug || '',
    category: frontmatter.category || '',
    sourceUrl: frontmatter.source_url || '',
    tags: frontmatter.tags ? frontmatter.tags.split(',').map((item) => item.trim()).filter(Boolean) : [],
  };
}

function flattenText(node) {
  if (!node) {
    return '';
  }

  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((item) => flattenText(item)).join('');
  }

  if (typeof node === 'object') {
    return Object.entries(node)
      .map(([key, value]) => {
        if (key === 'w:t') {
          return flattenText(value);
        }

        return flattenText(value);
      })
      .join('');
  }

  return '';
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) {
    return {
      body: raw,
      frontmatter: {},
    };
  }

  const endIndex = raw.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return {
      body: raw,
      frontmatter: {},
    };
  }

  const frontmatterBlock = raw.slice(4, endIndex).trim();
  const body = raw.slice(endIndex + 5);
  const frontmatter = {};

  for (const line of frontmatterBlock.split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!key) {
      continue;
    }

    frontmatter[key] = value;
  }

  return { body, frontmatter };
}

function buildSections(extracted) {
  if (extracted.format === 'markdown') {
    const parts = extracted.text.split(/\n(?=#{1,3}\s+)/g).map((part) => part.trim()).filter(Boolean);
    return parts.map((part, index) => {
      const lines = part.split('\n');
      const headingLine = lines.find((line) => /^#{1,6}\s+/.test(line)) || '';
      const heading = headingLine.replace(/^#{1,6}\s+/, '').trim() || extracted.title || `Section ${index + 1}`;
      return {
        heading,
        label: slugify(heading),
        text: part,
      };
    });
  }

  return [
    {
      heading: extracted.title || extracted.headings[0] || 'Knowledge Base',
      label: slugify(extracted.title || extracted.headings[0] || 'knowledge-base'),
      text: extracted.text,
    },
  ];
}

function chunkSections(sections, chunkSize = 850, overlap = 140) {
  const chunks = [];

  for (const section of sections) {
    const normalized = section.text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    let start = 0;

    while (start < normalized.length) {
      const end = Math.min(normalized.length, start + chunkSize);
      let chunk = normalized.slice(start, end);

      if (end < normalized.length) {
        const boundary = Math.max(chunk.lastIndexOf('\n\n'), chunk.lastIndexOf('. '), chunk.lastIndexOf('; '));
        if (boundary > chunkSize * 0.55) {
          chunk = chunk.slice(0, boundary + 1);
        }
      }

      const cleaned = chunk.trim();
      if (cleaned) {
        chunks.push({
          heading: section.heading,
          label: section.label,
          content: cleaned,
        });
      }

      if (end >= normalized.length) {
        break;
      }

      start += Math.max(chunk.length - overlap, 1);
    }
  }

  return chunks;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
