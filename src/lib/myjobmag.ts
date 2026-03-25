import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';

export type JobOpportunity = {
    id: string;
    title: string;
    organization: string;
    category: string;
    location: string | null;
    description: string;
    url: string;
    postedAt: string | null;
    deadline: string | null;
    jobType: string | null;
    source: 'myjobmag';
};

type FeedItem = {
    title?: string;
    industry?: string;
    link?: string;
    guid?: string;
    pubDate?: string;
    description?: string;
    url?: string;
    category?: string;
    job_category?: string;
    location?: string;
    state?: string;
    region?: string;
    summary?: string;
    date?: string;
    deadline?: string;
    jobType?: string;
    type?: string;
};

type ParsedFeed = {
    rss?: { channel?: { item?: FeedItem | FeedItem[] } };
    channel?: { item?: FeedItem | FeedItem[] };
    feed?: { entry?: FeedItem | FeedItem[] };
};

const FEEDS = [
    'https://www.myjobmag.com/feeds/ng/jobsxml_by_categories.xml',
    'https://www.myjobmag.com/feeds/ng/jobsxml.xml'
];

function safeParseDate(dateStr?: string | null): string | null {
    if (!dateStr) return null;
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0]; // Return YYYY-MM-DD for PG Date
    } catch {
        return null;
    }
}

function toFeedItems(value?: FeedItem | FeedItem[]): FeedItem[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

export async function fetchAndNormalizeJobs(): Promise<JobOpportunity[]> {
    const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true,
    });

    let rawItems: FeedItem[] = [];

    for (const url of FEEDS) {
        try {
            const response = await fetch(url, { next: { revalidate: 900 } }); // 15 mins cache
            if (!response.ok) continue;
            const xmlData = await response.text();
            const parsed = parser.parse(xmlData) as ParsedFeed;

            rawItems = toFeedItems(
                parsed?.rss?.channel?.item ??
                parsed?.channel?.item ??
                parsed?.feed?.entry
            );

            if (rawItems.length > 0) {
                break; // Successfully fetched from a feed
            }
        } catch (e) {
            console.warn(`Failed to fetch from MyJobMag feed: ${url}`, e);
        }
    }

    const jobs: JobOpportunity[] = [];
    const seenUrls = new Set<string>();

    for (const item of rawItems) {
        const link = item.link || item.url || item.guid || '';
        if (!link || seenUrls.has(link)) continue;
        seenUrls.add(link);

        const rawTitle = item.title || '';
        if (!rawTitle) continue;

        // Try to extract organization from "Title at Company"
        let title = rawTitle;
        let organization = 'Unknown Employer';

        // MyJobMag titles often follow "Job Title at Company Name"
        const atMatch = rawTitle.match(/(.+)\s+at\s+(.+)$/i);
        if (atMatch) {
            title = atMatch[1].trim();
            organization = atMatch[2].trim();
        }

        const hash = crypto.createHash('md5').update(link).digest('hex');
        const deterministicId = `${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(13, 16)}-8${hash.substring(17, 20)}-${hash.substring(20, 32)}`;

        jobs.push({
            id: deterministicId,
            title,
            organization,
            category: item.category || item.industry || item.job_category || 'General',
            location: item.location || item.state || item.region || 'Nigeria',
            description: item.description || item.summary || '',
            url: link,
            postedAt: safeParseDate(item.pubDate || item.date),
            deadline: safeParseDate(item.deadline),
            jobType: item.jobType || item.type || null,
            source: 'myjobmag'
        });
    }

    return jobs;
}
