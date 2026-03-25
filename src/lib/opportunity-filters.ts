import type { JobOpportunity } from '@/lib/myjobmag';

export type NavigatorExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior' | 'Executive';
export type NavigatorIndustry = 'Technology' | 'Finance' | 'Healthcare' | 'Operations' | 'General';
export type NavigatorWorkLocation = 'Remote' | 'Lagos' | 'Abuja' | 'Other Nigeria' | 'International';

export type OpportunityFilters = {
  search?: string;
  category?: string;
  experienceLevel?: string;
  industry?: string;
  workLocation?: string;
};

const NIGERIA_LOCATION_TERMS = [
  'nigeria',
  'abia',
  'adamawa',
  'akwa ibom',
  'anambra',
  'bauchi',
  'bayelsa',
  'benue',
  'borno',
  'cross river',
  'delta',
  'ebonyi',
  'edo',
  'ekiti',
  'enugu',
  'gombe',
  'imo',
  'jigawa',
  'kaduna',
  'kano',
  'katsina',
  'kebbi',
  'kogi',
  'kwara',
  'lagos',
  'nasarawa',
  'nassarawa',
  'niger',
  'ogun',
  'ondo',
  'osun',
  'oyo',
  'plateau',
  'rivers',
  'sokoto',
  'taraba',
  'yobe',
  'zamfara',
  'fct',
  'port harcourt',
  'ibadan',
  'ilorin',
  'uyo',
  'calabar',
  'abeokuta',
  'warri',
  'onitsha',
  'awka',
  'asaba',
  'jos',
];

const INDUSTRY_KEYWORDS: Record<Exclude<NavigatorIndustry, 'General'>, string[]> = {
  Technology: [
    'technology',
    'tech',
    'software',
    'engineering',
    'developer',
    'data',
    'product',
    'it ',
    'information technology',
    'digital',
    'telecom',
    'cybersecurity',
    'cloud',
  ],
  Finance: [
    'finance',
    'financial',
    'bank',
    'banking',
    'fintech',
    'account',
    'accounting',
    'audit',
    'investment',
    'insurance',
    'treasury',
    'tax',
  ],
  Healthcare: [
    'healthcare',
    'health care',
    'health',
    'medical',
    'clinical',
    'hospital',
    'pharmaceutical',
    'pharmacy',
    'nursing',
    'doctor',
    'patient',
  ],
  Operations: [
    'operations',
    'operation',
    'logistics',
    'procurement',
    'supply chain',
    'administration',
    'admin',
    'hr',
    'human resources',
    'customer service',
    'project management',
    'office management',
    'facility',
  ],
};

const INDUSTRY_ALIASES: Record<Exclude<NavigatorIndustry, 'General'>, string[]> = {
  Technology: ['it', 'ict', 'qa', 'ui', 'ux', 'frontend', 'backend', 'fullstack', 'devops', 'ai', 'ml'],
  Finance: ['aml', 'kyc', 'erp', 'bookkeeping'],
  Healthcare: ['dentist', 'surgeon', 'therapist', 'laboratory', 'lab', 'biomedical'],
  Operations: ['administrator', 'secretary', 'compliance', 'support'],
};

const EXPERIENCE_PATTERNS: Record<NavigatorExperienceLevel, RegExp[]> = {
  'Entry Level': [
    /\bentry(?:\s|-)?level\b/,
    /\bgraduate\b/,
    /\bgraduate trainee\b/,
    /\btrainee\b/,
    /\bintern(?:ship)?\b/,
    /\bjunior\b/,
    /\bassistant\b/,
    /\bnysc\b/,
    /\bresident doctor\b/,
    /\b0\s*-\s*2\s+years?\b/,
    /\b0\s*-\s*1\s+years?\b/,
    /\b1\s*-\s*2\s+years?\b/,
    /\b1\s+year\b/,
    /\b2\s+years?\s+max(?:imum)?\b/,
    /\bno experience\b/,
  ],
  'Mid Level': [
    /\bmid(?:\s|-)?level\b/,
    /\bassociate\b/,
    /\bspecialist\b/,
    /\bofficer\b/,
    /\bcoordinator\b/,
    /\b3\s*-\s*5\s+years?\b/,
    /\b4\s*\+?\s+years?\b/,
    /\b5\s*\+?\s+years?\b/,
  ],
  Senior: [
    /\bsenior\b/,
    /\blead\b/,
    /\bprincipal\b/,
    /\bmanager\b/,
    /\bteam lead\b/,
    /\bhead of\b/,
    /\b6\s*\+?\s+years?\b/,
    /\b7\s*\+?\s+years?\b/,
    /\b8\s*\+?\s+years?\b/,
  ],
  Executive: [
    /\bexecutive\b/,
    /\bdirector\b/,
    /\bchief\b/,
    /\bceo\b/,
    /\bcfo\b/,
    /\bcoo\b/,
    /\bcto\b/,
    /\bvice president\b/,
    /\bvp\b/,
    /\bpresident\b/,
    /\bc-suite\b/,
  ],
};

function normalizeText(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^a-z0-9/+\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSearchText(job: JobOpportunity): string {
  return normalizeText(
    [
      job.title,
      job.organization,
      job.category,
      job.location,
      job.description,
      job.jobType,
    ].join(' ')
  );
}

function buildJobFields(job: JobOpportunity) {
  return {
    title: normalizeText(job.title),
    organization: normalizeText(job.organization),
    category: normalizeText(job.category),
    location: normalizeText(job.location),
    description: normalizeText(job.description),
    jobType: normalizeText(job.jobType),
  };
}

function countPatternMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

function countKeywordHits(text: string, keywords: string[]): number {
  if (!text) {
    return 0;
  }

  return keywords.reduce((count, keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) {
      return count;
    }

    const pattern = normalizedKeyword.includes(' ')
      ? new RegExp(`(^|\\s)${escapeRegExp(normalizedKeyword)}(?=\\s|$)`)
      : new RegExp(`\\b${escapeRegExp(normalizedKeyword)}\\b`);

    return count + (pattern.test(text) ? 1 : 0);
  }, 0);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function inferExperienceLevel(job: JobOpportunity): NavigatorExperienceLevel | null {
  const fields = buildJobFields(job);
  const headlineText = [fields.title, fields.jobType, fields.category].filter(Boolean).join(' ');
  const detailText = [headlineText, fields.description].filter(Boolean).join(' ');

  const executiveScore =
    countPatternMatches(headlineText, EXPERIENCE_PATTERNS.Executive) * 3 +
    countPatternMatches(detailText, EXPERIENCE_PATTERNS.Executive);
  const seniorScore =
    countPatternMatches(headlineText, EXPERIENCE_PATTERNS.Senior) * 3 +
    countPatternMatches(detailText, EXPERIENCE_PATTERNS.Senior);
  const entryScore =
    countPatternMatches(headlineText, EXPERIENCE_PATTERNS['Entry Level']) * 3 +
    countPatternMatches(detailText, EXPERIENCE_PATTERNS['Entry Level']);
  const midScore =
    countPatternMatches(headlineText, EXPERIENCE_PATTERNS['Mid Level']) * 3 +
    countPatternMatches(detailText, EXPERIENCE_PATTERNS['Mid Level']);

  if (executiveScore > 0) {
    return 'Executive';
  }

  if (seniorScore > 0) {
    return 'Senior';
  }

  if (midScore >= 3 && entryScore === 0) {
    return 'Mid Level';
  }

  if (entryScore >= 3) {
    return 'Entry Level';
  }

  if (midScore > 0) {
    return 'Mid Level';
  }

  return null;
}

function matchesIndustry(job: JobOpportunity, industry: string): boolean {
  if (!industry || industry === 'General') {
    return true;
  }

  const keywords = INDUSTRY_KEYWORDS[industry as Exclude<NavigatorIndustry, 'General'>];
  if (!keywords) {
    return false;
  }

  const aliases = INDUSTRY_ALIASES[industry as Exclude<NavigatorIndustry, 'General'>] ?? [];
  const searchTerms = [...keywords, ...aliases];
  const fields = buildJobFields(job);
  const weightedScore =
    countKeywordHits(fields.title, searchTerms) * 5 +
    countKeywordHits(fields.category, searchTerms) * 4 +
    countKeywordHits(fields.organization, searchTerms) * 3 +
    countKeywordHits(fields.jobType, searchTerms) * 2 +
    countKeywordHits(fields.description, searchTerms);

  const competingScore = (Object.keys(INDUSTRY_KEYWORDS) as Array<Exclude<NavigatorIndustry, 'General'>>)
    .filter((candidate) => candidate !== industry)
    .reduce((highestScore, candidate) => {
      const candidateTerms = [...INDUSTRY_KEYWORDS[candidate], ...(INDUSTRY_ALIASES[candidate] ?? [])];
      const candidateScore =
        countKeywordHits(fields.title, candidateTerms) * 5 +
        countKeywordHits(fields.category, candidateTerms) * 4 +
        countKeywordHits(fields.organization, candidateTerms) * 3 +
        countKeywordHits(fields.jobType, candidateTerms) * 2 +
        countKeywordHits(fields.description, candidateTerms);

      return Math.max(highestScore, candidateScore);
    }, 0);

  const hasHeadlineSignal =
    countKeywordHits(fields.title, searchTerms) > 0 ||
    countKeywordHits(fields.category, searchTerms) > 0 ||
    countKeywordHits(fields.organization, searchTerms) > 0;

  if (!hasHeadlineSignal && weightedScore < 6) {
    return false;
  }

  return weightedScore >= 5 && weightedScore > competingScore;
}

function isNigeriaLocation(text: string): boolean {
  return NIGERIA_LOCATION_TERMS.some((term) => text.includes(term));
}

function matchesWorkLocation(job: JobOpportunity, workLocation: string): boolean {
  if (!workLocation) {
    return true;
  }

  const location = normalizeText(job.location);

  if (!location) {
    return false;
  }

  switch (workLocation as NavigatorWorkLocation) {
    case 'Remote':
      return /\bremote\b|\bwork from home\b|\bwfh\b/.test(location);
    case 'Lagos':
      return /\blagos\b/.test(location);
    case 'Abuja':
      return /\babuja\b|\bfct\b/.test(location);
    case 'Other Nigeria':
      return isNigeriaLocation(location) && !/\blagos\b|\babuja\b|\bfct\b/.test(location);
    case 'International':
      return !isNigeriaLocation(location) && !/\bremote\b|\bwork from home\b|\bwfh\b/.test(location);
    default:
      return false;
  }
}

export function filterOpportunities(
  jobs: JobOpportunity[],
  filters: OpportunityFilters
): JobOpportunity[] {
  const search = normalizeText(filters.search);

  return jobs.filter((job) => {
    if (filters.category && filters.category !== 'All' && job.category !== filters.category) {
      return false;
    }

    if (search) {
      const searchableText = buildSearchText(job);
      if (!searchableText.includes(search)) {
        return false;
      }
    }

    if (filters.industry && !matchesIndustry(job, filters.industry)) {
      return false;
    }

    if (filters.workLocation && !matchesWorkLocation(job, filters.workLocation)) {
      return false;
    }

    if (filters.experienceLevel) {
      const inferredLevel = inferExperienceLevel(job);
      if (inferredLevel !== filters.experienceLevel) {
        return false;
      }
    }

    return true;
  });
}
