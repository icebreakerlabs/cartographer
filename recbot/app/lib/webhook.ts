/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHmac } from 'crypto';
import { type NextRequest } from 'next/server';
import { type WebhookData } from './types';
import { neynarClient } from './utils';

export async function processWebhookBody(webhook: WebhookData) {
  const type = webhook.type;
  const data = webhook.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { author, mentioned_profiles, parent_hash } = data;

  if (type !== 'cast.created' || !data) {
    throw new Error('Invalid webhook payload');
  }

  const acceptedCredentialsAndSkills = [
    "Skill: Product",
    "Skill: Design",
    "Skill: Engineering",
    "Skill: Marketing",
    "Skill: Legal",
    "Skill: Finance",
    "Skill: Operations",
    "Skill: Sales",
    "Skill: Support",
    "Skill: Talent",
    "Skill: Data",
    "qBuilder"
  ];

  const botUsername = "rec";
  const match = data.text.match(new RegExp(`^@${botUsername} \\S+ (.+)$`));
  const mentionedUsernames = mentioned_profiles.map(profile => profile.username);
  const isValidSkill = match && acceptedCredentialsAndSkills.includes(match[1]) && mentionedUsernames.includes(match[0]);

  if (parent_hash) {
    // Add logic here to check the parent cast if needed
  } else if (isValidSkill) {
    const newCast = await neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Success!', {
      replyTo: data.hash,
    });
    console.log(`New cast: ${newCast.hash}`);
  } else {
    await neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Failed. Too soon', {
      replyTo: data.hash,
    });
  }

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