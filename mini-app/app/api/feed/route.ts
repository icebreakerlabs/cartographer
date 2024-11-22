import { neynarClient } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { FeedType } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/feed-type';
import { FilterType } from '@neynar/nodejs-sdk';
import { FeedResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2';

export async function GET(request: NextRequest) {
  try {
    const fidsParam = request.nextUrl.searchParams.get('fids');
    const fids = fidsParam ? fidsParam.split(',').map(Number) : [];
    const parentUrl = request.nextUrl.searchParams.get('parent_url') || undefined;
    const withRecasts = request.nextUrl.searchParams.get('with_recasts') === 'true';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '25', 10);
    const cursor = request.nextUrl.searchParams.get('cursor') || undefined;
    const viewerFid = request.nextUrl.searchParams.get('viewer_fid') ? parseInt(request.nextUrl.searchParams.get('viewer_fid')!) : undefined;

    const feedRequest: FeedResponse = await neynarClient.fetchFeed(FeedType.Filter, {
      filterType: FilterType.Fids,
      fids: fids,
      parentUrl: parentUrl,
      limit,
      cursor,
      withRecasts,
      viewerFid,
    });

    return NextResponse.json(feedRequest);
  } catch (error) {
    console.error('Error fetching data from Neynar API', error);
    return new NextResponse('Error fetching data from Neynar API', {
      status: 500,
    });
  }
}