/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHmac } from 'crypto';
import { type NextRequest } from 'next/server';
import { IcebreakerPOSTParams, type WebhookData } from './types';
import { getEthAddressForUser, ICEBREAKER_API_URL, neynarClient } from './utils';
import { attestationsAndSkills, isValidSkill } from './attestation-matcher';

export async function extractEndorsementFromCast(webhook: WebhookData){
  const skillResp = isValidSkill(webhook.data.text, webhook.data.mentioned_profiles);
  if(skillResp.isValid){ 
    const attesterAddress = getEthAddressForUser(webhook.data.author);
    const attesteeUser = webhook.data.mentioned_profiles.find((profile) => profile.username === skillResp.mentionedUsername);
    const attesteeAddress = attesteeUser ? getEthAddressForUser(attesteeUser) : '0x';
    const schema = attestationsAndSkills.find((item) => item.name === skillResp.skill);
    const json: IcebreakerPOSTParams = {
      attesterAddress: attesterAddress,
      attesteeAddress: attesteeAddress,
      isPublic: true,
      name: skillResp.skill,
      schemaID: schema?.schemaID ?? '-1',
      source: 'Farcaster',
      reference: webhook.data.hash,
      timestamp: webhook.data.timestamp,
      uid: `${webhook.data.hash}000000000000000000000000`
    }
    try{
      await Promise.all([
        neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Success!', {
          replyTo: webhook.data.hash,
        }),
        fetch(`${ICEBREAKER_API_URL}/v1/credentials/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.ICEBREAKER_BEARER_TOKEN}`
          },
          body: JSON.stringify(json)
        })
      ]);
    } catch(err){
      return (err as Error).message;
    }
  } 
  else {
    try{
      await neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Failed. Too soon', {
        replyTo: webhook.data.hash,
      });
    } catch(err){
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
  return body;
}