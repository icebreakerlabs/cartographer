import { NextRequest, NextResponse } from 'next/server';
import { processWebhookBody, verifyWebhookSignature } from '@/app/lib/webhook';
import { type WebhookData } from '@/app/lib/types';

export async function POST(request: NextRequest) {
  try {
    console.log(request);


    const body = await verifyWebhookSignature(request);
    const payload: WebhookData = JSON.parse(body);

    console.log(payload);

    const result = await processWebhookBody(payload);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new NextResponse('Error handling webhook', { status: 500 });
  }
}
