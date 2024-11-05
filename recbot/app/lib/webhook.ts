/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHmac } from 'crypto';
import { type NextRequest } from 'next/server';
import { IcebreakerPOSTParams, type WebhookData } from './types';
import { neynarClient } from './utils';
import { isValidSkill } from './attestation-matcher';
import { CastParamType } from '@neynar/nodejs-sdk';

export async function extractEndorsementFromCast(webhook: WebhookData){
  const isValid = isValidSkill(webhook.data.text, webhook.data.mentioned_profiles);
  if(isValid.isValid){ 
    const json: IcebreakerPOSTParams = {
      attesterAddress: '',
      attesteeAddress: '',
      name: isValid.skill,
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
        fetch("https://icebreaker-cards-git-dev-icebreaker-labs.vercel.app/api/v1/credentials/store", {
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
  } else {
    if(webhook.data.parent_hash){
      const res = await neynarClient.lookupCastConversation(webhook.data.parent_hash, CastParamType.Hash);
      const parent = res.conversation.cast;
      const isParentValid = isValidSkill(parent.text, parent.mentioned_profiles);
      if(isParentValid.isValid){ 
        const json: IcebreakerPOSTParams = {
          attesterAddress: '',
          attesteeAddress: '',
          name: isParentValid.skill,
          source: 'Farcaster',
          reference: parent.hash,
          timestamp: parent.timestamp,
          uid: `${parent.hash}000000000000000000000000`
        }
        try{
          await Promise.all([
            neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Success!', {
              replyTo: parent.hash,
            }),
            fetch("https://app.icebreaker.xyz/api/v1/credentials/store", {
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
    }
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

  const result = await extractEndorsementFromCast(webhook);
  console.log(result);
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