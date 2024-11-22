import { NextRequest, NextResponse } from 'next/server';
import { ICEBREAKER_API_URL } from '@/app/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');
    if (!address) {
      throw new Error('address is required');
    }

    const response = await fetch(`${ICEBREAKER_API_URL}/v1/eth/${address}`);
    if (!response.ok) {
      throw new Error('Error fetching data from Icebreaker API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Icebreaker API', error);
    return new NextResponse('Error fetching data from Icebreaker API', {
      status: 500,
    });
  }
}