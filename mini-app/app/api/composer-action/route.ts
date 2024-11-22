import { BASE_URL } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    "type": "composer",
    "name": "Icebreaker Feed",
    "icon": "star",
    "description": "Credentialed feeds",
    "aboutUrl": "https://icebreaker.xyz",
    "imageUrl": "https://i.imgur.com/9JoDfFl.jpg",
    "action": {
      "type": "post",
    }
  });
}

export async function POST(req: NextRequest) {
  const { state } = await req.json();
  console.log(state);
  return NextResponse.json({
    "type": "form",
    "title": "Icebreaker Feed",
    "url": `${BASE_URL}`
  });
}