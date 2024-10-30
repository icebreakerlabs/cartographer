/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

export async function verifyWebhookSignature(req: NextRequest): Promise<any> {
  const body = await req.text();
  
  const sig = req.headers.get("X-Neynar-Signature");
  if (!sig) {
    throw new Error("X-Neynar-Signature is missing from the request headers");
  }

  const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Make sure to set NEYNAR_WEBHOOK_SECRET in your .env file");
  }

  const hmac = createHmac("sha512", webhookSecret);
  hmac.update(body);

  const generatedSignature = hmac.digest("hex");

  const isValid = generatedSignature === sig;
  if (!isValid) {
        throw new Error("Invalid Neynar webhook signature");
  }
  return body
}