/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHmac } from 'crypto';
import { type NextRequest } from 'next/server';
import {
  type WebhookData,
} from './types';
import {
  getEthAddressForUser,
} from './utils';
import { getRecommendationData } from './getRecommendationData';
import { getSignerUuid, neynar } from './neynar';

export async function extractEndorsementFromCast(webhook: WebhookData) {
  const parentAuthorFid = webhook.data.parent_author?.fid;
  const parentAuthorFname = parentAuthorFid
    ? (await neynar.fetchBulkUsers({ fids: [parentAuthorFid] })).users[0]?.username
    : undefined;

  const { isValid, botResponse } = await getRecommendationData(
    webhook.data.text,
    webhook.data.mentioned_profiles,
    webhook.data.author.username,
    parentAuthorFname
  );

  const signerUuid = await getSignerUuid();

  if (isValid) {
    const attesterAddress = await getEthAddressForUser(webhook.data.author);
    if (attesterAddress === '0x') {
      throw new Error('Attester address not found');
    }

    try {

      await neynar.publishCast({
        signerUuid,
        text: botResponse,
        parent: webhook.data.hash,
      });
    } catch (err) {
      console.error(err);
      return (err as Error).message;
    }
  } else {
    try {
      await neynar.publishCast({
        signerUuid,
        text: botResponse,
        parent: webhook.data.hash,
      });
    } catch (err) {
      console.error('Error publishing cast:', err);
      return (err as Error).message;
    }
  }
}

export async function processWebhookBody(webhook: WebhookData) {
  if (webhook.type !== 'cast.created' || !webhook.data) {
    throw new Error('Invalid webhook payload');
  }

  await extractEndorsementFromCast(webhook);
  return { success: true };
}

export async function verifyWebhookSignature(req: NextRequest): Promise<any> {
  const body = await req.text();

  const sig = req.headers.get('X-Neynar-Signature');
  if (!sig) {
    throw new Error('X-Neynar-Signature is missing from the request headers');
  }

  const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Make sure to set NEYNAR_WEBHOOK_SECRET in your .env file');
  }

  const hmac = createHmac('sha512', webhookSecret);
  hmac.update(body);

  const generatedSignature = hmac.digest('hex');

  const isValid = generatedSignature === sig;
  if (!isValid) {
    throw new Error('Invalid Neynar webhook signature');
  }
  return body;
}
