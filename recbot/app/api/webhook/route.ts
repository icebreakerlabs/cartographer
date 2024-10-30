/* eslint-disable @typescript-eslint/no-explicit-any */
import { neynarClient } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

type WebhookData = {
  created_at: number;
  type: string;
  data: {
    object: string;
    hash: string;
    author: {
      object: string;
      fid: number;
      username: string;
      display_name: string;
      pfp_url: string;
      custody_address: string;
      profile: {
        bio: {
          text: string;
        };
      };
      follower_count: number;
      following_count: number;
      verifications: any[];
      verified_addresses: {
        eth_addresses: string[];
        sol_addresses: string[];
      };
      verified_accounts: any | null;
      power_badge: boolean;
    };
    thread_hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    root_parent_url: string | null;
    parent_author: {
      fid: number | null;
    };
    text: string;
    timestamp: string;
    embeds: any[];
    channel: string | null;
    reactions: {
      likes_count: number;
      recasts_count: number;
      likes: any[];
      recasts: any[];
    };
    replies: {
      count: number;
    };
    mentioned_profiles: any[];
    event_timestamp: string;
  };
};

export async function POST(request: NextRequest) {
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

  const botUsername = "botUsername";
  const botFid = 823009;
  const body = await request.json();
  if (!body || typeof body !== 'object' || !body.data) {
    throw new Error('Invalid webhook data');
  }
  const webhookData: WebhookData = body;
  const match = webhookData.data.text.match(new RegExp(`^@${botUsername} \\S+ (.+)$`));
  const isValidSkill = match && acceptedCredentialsAndSkills.includes(match[1]);

  if (
    webhookData &&
    webhookData.data.author.fid === botFid &&
    isValidSkill
  ) {
    const newCast = await neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Confirmed!', {
      replyTo: webhookData.data.hash,
    });
    console.log(`New cast: ${newCast.hash}`);
  } else {
    await neynarClient.publishCast(process.env.NEYNAR_SIGNER_UUID ?? "", 'Failed, invalid format', {
      replyTo: webhookData.data.hash,
    });
  }
  return NextResponse.json({ success: true });
}