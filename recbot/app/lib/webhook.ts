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
import { neynar } from './neynar';
import { getRecommendationData } from './getRecommendationData';
import { attestationSchemas } from './attestationSchemas';
import { getReplyCastData } from './getReplyCastData';

const NEYNAR_SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID ?? '';

export async function extractEndorsementFromCast(webhook: WebhookData) {
  const parentAuthorFid = webhook.data.parent_author?.fid;
  const parentAuthorFname = parentAuthorFid
    ? (await neynar.fetchBulkUsers({ fids: [parentAuthorFid] })).users[0]
        ?.username
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

      console.log('getReplyCastData called with inputs and output:', {
        inputs: {
          isValid,
          schemaName,
          requiredSchemaName: schema?.requiredSchemaName,
          responseOk: response.ok,
        },
        castData,
      });

      const options = {
        signerUuid: NEYNAR_SIGNER_UUID,
        text: castData.text,
        embeds: castData.embeds,
        parent: webhook.data.hash,
      };

      console.log('Publishing cast:', options);

      await neynar.publishCast(options);
    } catch (err) {
      console.error(err);
      return (err as Error).message;
    }
  } else {
    try {
      const castData = getReplyCastData(isValid, schemaName);
      console.log('getReplyCastData called with inputs and output:', {
        inputs: { isValid, schemaName },
        castData,
      });

      await neynar.publishCast({
        signerUuid: NEYNAR_SIGNER_UUID,
        text: castData.text,
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

export async function verifyWebhookSignature(req: NextRequest) {
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
