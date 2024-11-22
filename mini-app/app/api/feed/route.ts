import { FeedResponse } from '@/app/lib/types';
import { NEYNAR_API_URL } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const fidsParam = request.nextUrl.searchParams.get('fids');
    const fids = fidsParam ? fidsParam.split(',').map(Number) : [];
    const parentUrl = request.nextUrl.searchParams.get('parent_url') || undefined;
    const withRecasts = request.nextUrl.searchParams.get('with_recasts') === 'true';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '25', 10);
    const cursor = request.nextUrl.searchParams.get('cursor') || undefined;
    const viewerFid = request.nextUrl.searchParams.get('viewer_fid') ? parseInt(request.nextUrl.searchParams.get('viewer_fid')!) : parseInt('616');

    const response = await fetch(`${NEYNAR_API_URL}/v2/farcaster/feed?fids=${fids.join(',')}&parent_url=${parentUrl}&with_recasts=${withRecasts}&feed_type=filter&limit=${limit}&cursor=${cursor}&viewer_fid=${viewerFid}`, {
      headers: {
        'x-api-key': process.env.NEYNAR_API_KEY ?? ""
      }
    });
    const feedRequest: FeedResponse = await response.json();

    return NextResponse.json(feedRequest);
  } catch (error) {
    console.error('Error fetching data from Neynar API', error);
    return new NextResponse('Error fetching data from Neynar API', {
      status: 500,
    });
  }
}