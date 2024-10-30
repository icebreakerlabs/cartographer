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
  // TODO: move botUsername and botFid to `consts.ts`
  const botUsername = "botUsername";
  const botFid = 823009;
  const body = await request.json();
  if (!body || typeof body !== 'object' || !body.data) {
    throw new Error('Invalid webhook data');
  }
  const webhookData: WebhookData = body;
  // TODO: expand on RegExp params when we have a set list of attestations/badges that can be given out
  if (
    webhookData &&
    webhookData.data.author.fid === botFid &&
    new RegExp(`^@${botUsername} \\S+ \\S+`).test(webhookData.data.text)
  ) {
    const newCast = await neynarClient.publishCast('SIGNER_UUID', 'Confirmed!', {
      replyTo: webhookData.data.hash,
    });
    // TODO: call the Icebreaker POST route here, Promise.all this whole part
    console.log(`New cast: ${newCast.hash}`);
  }
  return NextResponse.json({ success: true });
}