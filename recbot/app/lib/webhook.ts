/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHmac } from 'crypto';
import { type NextRequest } from 'next/server';
import {
  type IcebreakerStoreCredentialsParams,
  type WebhookData,
} from './types';
import {
  getEthAddressForUser,
  ICEBREAKER_API_URL,
  ICEBREAKER_CREDENTIALS_URL,
  neynarClient,
} from './utils';
import {
  attestationsSchemas,
  getRecommendationData,
} from './attestation-matcher';

export async function extractEndorsementFromCast(webhook: WebhookData) {
  console.log(JSON.stringify(webhook, null, 2));
  const parentAuthorFid = webhook.data.parent_author?.fid;
  const parentAuthorFname = parentAuthorFid
    ? (await neynarClient.fetchBulkUsers([parentAuthorFid])).users[0]?.username
    : undefined;

  console.log(parentAuthorFname);

  const { isValid, attesteeFname, schemaName } = await getRecommendationData(
    webhook.data.text,
    webhook.data.mentioned_profiles,
    webhook.data.author.username,
    parentAuthorFname
  );
  console.log(isValid, attesteeFname, schemaName);
  if (isValid) {
    const attesterAddress = await getEthAddressForUser(webhook.data.author);
    if (attesterAddress === '0x') {
      throw new Error('Attester address not found');
    }
    const attesteeUser = webhook.data.mentioned_profiles.find(
      (profile) => profile.username === attesteeFname
    );
    const attesteeAddress = attesteeUser
      ? await getEthAddressForUser(attesteeUser)
      : '0x';
    const schema = attestationsSchemas.find(
      (schema) => schema.name === schemaName
    );
    const json: IcebreakerStoreCredentialsParams = {
      attesterAddress: attesterAddress,
      attesteeAddress: attesteeAddress,
      isPublic: true,
      name: schemaName,
      schemaID: schema?.schemaID ?? '-1',
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

      const encodedCredentialName = encodeURIComponent(schemaName);

      // TODO: parse `response.json` and check the message field instead of just checking for `response.ok`
      await neynarClient.publishCast(
        process.env.NEYNAR_SIGNER_UUID ?? '',
        response.ok
          ? `Success! Visit ${ICEBREAKER_CREDENTIALS_URL}/${encodedCredentialName}?show=receivers to view on Icebreaker.`
          : 'Beep boop. Something went wrong.',
        {
          replyTo: webhook.data.hash,
        }
      );
    } catch (err) {
      return (err as Error).message;
    }
  } else {
    try {
      await neynarClient.publishCast(
        process.env.NEYNAR_SIGNER_UUID ?? '',
        schemaName
          ? `You must receive an endorsement for ${schemaName} before you can endorse others.`
          : 'Unable to endorse. Make sure to format with: (at)rec (at)<username> <endorsement>',
        {
          replyTo: webhook.data.hash,
        }
      );
    } catch (err) {
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
