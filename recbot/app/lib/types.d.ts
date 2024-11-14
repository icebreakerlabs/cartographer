/* eslint-disable @typescript-eslint/no-explicit-any */

import { type User } from '@neynar/nodejs-sdk/build/neynar-api/v2';

export type IcebreakerUser = {
  profileID: string;
  walletAddress: string;
  avatarUrl: string;
  displayName: string;
  bio: string;
  jobTitle: string;
  primarySkill: string;
  networkingStatus: string;
  location: string;
  channels: {
    type: string;
    isVerified: boolean;
    isLocked: boolean;
    value: string;
    url: string;
    metadata?: {
      name: string;
      value: string;
    }[];
  }[];
  credentials: {
    name: string;
    chain: string;
    source: string;
    reference: string;
  }[];
  highlights: string[];
  workExperience: string[];
  events: {
    id: string;
    source: string;
    city: string;
    country: string;
    description: string;
    endDate: string;
    eventUrl: string;
    expiryDate: string;
    imageUrl: string;
    name: string;
    startDate: string;
    year: string;
  }[];
  guilds: {
    guildId: number;
    joinedAt: string;
    roleIds: number[];
    isAdmin: boolean;
    isOwner: boolean;
  }[];
};

export type IcebreakerStoreCredentialsParams = {
  schemaID?: string;
  attesterPKID?: string;
  attesteePKID?: string;
  attesterAddress?: string;
  attesteeAddress?: string;
  name?: string;
  value?: string;
  source?: string;
  reference?: string;
  chain?: ChainSlug;
  timestamp?: number | string;
  uid?: string;
  isPublic?: boolean;
  isRevoked?: boolean;
  data?: string;
};

export type WebhookData = {
  created_at: number;
  type: string;
  data: {
    object: string;
    hash: string;
    author: User;
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
    mentioned_profiles: User[];
    event_timestamp: string;
  };
};
