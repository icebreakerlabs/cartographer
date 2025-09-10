import { NextRequest, NextResponse } from 'next/server';
import { extractEndorsementFromPost } from '@/app/lib/extractEndorsementFromPost';
import { type ProcessBodyObject } from '@/app/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const webhookSecret = process.env.X_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Make sure to set X_WEBHOOK_SECRET in your .env file');
    }
    const sig = request.headers.get('X-Signature');
    if (!sig || sig !== webhookSecret) {
      throw new Error('Invalid X-Signature');
    }

    const payload: ProcessBodyObject = JSON.parse(body);

    await extractEndorsementFromPost({
      authorUsername: payload.authorUsername,
      parentAuthorUsername: payload.parentAuthorUsername,
      postId: payload.postId,
      text: payload.text,
      mentionedUsernames: payload.mentionedUsernames,
      channelType: 'x',
      timestamp: payload.timestamp,
      type: payload.type,
      parentPostId: payload.parentPostId,
    });
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling X webhook:', error);
    return new NextResponse('Error handling Twitter webhook', { status: 500 });
  }
}
