import { NextRequest, NextResponse } from 'next/server';
import { neynarClient } from '@/app/lib/utils';
import { verifyWebhookSignature } from '@/app/lib/webhook';
import { type WebhookData } from '@/app/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await verifyWebhookSignature(request);
    const payload: WebhookData = JSON.parse(body);
    const type = payload.type;
    const data = payload.data;

    if (type !== 'cast.created' || !data) {
      console.error('Invalid webhook payload:', payload);
      return new NextResponse('Invalid webhook payload', { status: 400 });
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
    const isValidSkill = match && acceptedCredentialsAndSkills.includes(match[1]);

    if (isValidSkill) {
      const newCast = await neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Success!', {
        replyTo: data.hash,
      });
      console.log(`New cast: ${newCast.hash}`);
    } else {
      await neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Failed. Too soon', {
        replyTo: data.hash,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new NextResponse('Error handling webhook', { status: 500 });
  }
}