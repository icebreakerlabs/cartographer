/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHmac } from 'crypto';
import { type NextRequest } from 'next/server';
import {
  type IcebreakerStoreCredentialsParams,
  type WebhookData,
} from './types';
import {
  getEthAddressForFname,
  getEthAddressForUser,
  ICEBREAKER_API_URL,
} from './utils';
import { getRecommendationData } from './getRecommendationData';
import { attestationSchemas } from './attestationSchemas';
import { getReplyCastData } from './getReplyCastData';
import { neynar } from './neynar';

export async function extractEndorsementFromCast(webhook: WebhookData) {
  const parentAuthorFid = webhook.data.parent_author?.fid;
  const parentAuthorFname = parentAuthorFid
    ? (await neynar.fetchBulkUsers({ fids: [parentAuthorFid] })).users[0]?.username
    : undefined;

  const { isValid, attesteeFname, schemaName } = await getRecommendationData(
    webhook.data.text,
    webhook.data.mentioned_profiles,
    webhook.data.author.username,
    parentAuthorFname
  );

  const schema = attestationSchemas.find(
    (schema) => schema.name === schemaName
  );

  // const signerUuid = await getSignerUuid();

  if (isValid) {
    const attesterAddress = await getEthAddressForUser(webhook.data.author);
    if (attesterAddress === '0x') {
      throw new Error('Attester address not found');
    }

    const attesteeAddress = await getEthAddressForFname(attesteeFname);

    const json: IcebreakerStoreCredentialsParams = {
      attesterAddress: attesterAddress,
      attesteeAddress: attesteeAddress,
      isPublic: true,
      name: schemaName,
      schemaID: schema?.id ?? '-1',
      source: 'Farcaster',
      reference: webhook.data.hash,
      timestamp: webhook.data.timestamp,
      uid: `${webhook.data.hash}000000000000000000000000`,
    };

    try {
      const response = await fetch(`${ICEBREAKER_API_URL}/v1/credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ICEBREAKER_BEARER_TOKEN}`,
        },
        body: JSON.stringify(json),
      });

      const castData = getReplyCastData(
        isValid,
        schemaName,
        schema?.requiredSchemaName,
        response.ok
      );
      console.log('published cast: ', castData.text);

      // await neynar.publishCast({
      //   signerUuid,
      //   text: castData.text,
      //   parent: webhook.data.hash,
      //   embeds: castData.embeds,
      // });
    } catch (err) {
      console.error(err);
      return (err as Error).message;
    }
  } else {
    try {
      // await neynar.publishCast({
      //   signerUuid,
      //   text: getReplyCastData(isValid, schemaName).text,
      //   parent: webhook.data.hash,
      // });
      console.log('published cast: ', getReplyCastData(isValid, schemaName).text);
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

// Test the function with a sample webhook
const testWebhook: WebhookData = {
  created_at: 1708025006,
  type: "cast.created",
  data: {
    object: "cast",
    hash: "0xfe7908021a4c0d36d5f7359975f4bf6eb9fbd6f2",
    thread_hash: "0xfe7908021a4c0d36d5f7359975f4bf6eb9fbd6f2",
    parent_hash: null,
    parent_url: null,
    root_parent_url: null,
    parent_author: { fid: null },
    author: {
      object: "user",
      fid: 234506,
      custody_address: "0x3ee6076e78c6413c8a3e1f073db01f87b63923b0",
      username: "balzgolf",
      display_name: "Balzgolf",
      pfp_url: "https://i.imgur.com/U7ce6gU.jpg",
      profile: {} as any,
      follower_count: 65,
      following_count: 110,
      verifications: ["0x8c16c47095a003b726ce8deffc39ee9cb1b9f124"],
      verified_addresses: { eth_addresses: [], sol_addresses: [], primary: {} as any },
      verified_accounts: [],
      power_badge: false,
      score: 0,
      active_status: "inactive"
    } as any,
    text: "@rec @charlie is a wonderful engineer",
    timestamp: "2024-02-15T19:23:22.000Z",
    embeds: [],
    reactions: { likes: [], recasts: [], likes_count: 0, recasts_count: 0 },
    replies: { count: 0 },
    mentioned_profiles: [],
    channel: null,
    event_timestamp: "2024-02-15T19:23:22.000Z"
  }
};

// Uncomment the line below to run the test
extractEndorsementFromCast(testWebhook);