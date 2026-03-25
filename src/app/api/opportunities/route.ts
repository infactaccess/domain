import { NextResponse } from 'next/server';
import { fetchAndNormalizeJobs } from '@/lib/myjobmag';
import { filterOpportunities } from '@/lib/opportunity-filters';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const experienceLevel = searchParams.get('experienceLevel') || '';
    const industry = searchParams.get('industry') || '';
    const workLocation = searchParams.get('workLocation') || '';
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);

    const allJobs = await fetchAndNormalizeJobs();

    const rawCategories = Array.from(new Set(allJobs.map((job) => job.category).filter(Boolean)));
    const categories = rawCategories.sort((a, b) => a.localeCompare(b));

    const filteredJobs = filterOpportunities(allJobs, {
      search,
      category,
      experienceLevel,
      industry,
      workLocation,
    });

    const total = filteredJobs.length;
    const start = page * pageSize;
    const paginatedJobs = filteredJobs.slice(start, start + pageSize);

    return NextResponse.json({
      items: paginatedJobs,
      total,
      page,
      pageSize,
      categories,
      source: 'myjobmag',
    });
  } catch (error) {
    console.error('Error in opportunities API:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}
