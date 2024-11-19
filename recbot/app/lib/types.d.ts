/* eslint-disable @typescript-eslint/no-explicit-any */

import { type User } from '@neynar/nodejs-sdk/build/neynar-api/v2';

export type AttestationSchema = {
  schemaID: string;
  name: string;
  isOpen: boolean;
  allowRecursion: boolean;
  requiredSchemaName?: string;
};

export type IcebreakerChannel = {
  type: string;
  isVerified?: boolean;
  isLocked?: boolean;
  value?: string;
  url?: string;
};

export type IcebreakerCredential = {
  name: string;
  chain: string;
  source?: string;
  reference?: string;
};

export type IcebreakerHighlight = {
  title?: string;
  url?: string;
};

export type IcebreakerWorkExperience = {
  jobTitle?: string;
  orgWebsite?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  isVerified?: boolean;
};

export type IcebreakerEvent = {
  id: string;
  source: string;
  name: string;
  description?: string;
  eventUrl?: string;
  imageUrl?: string;
};

export type IcebreakerGuildMembership = {
  guildId: number;
  roleIds: number[];
  isAdmin: boolean;
  isOwner: boolean;
  joinedAt: Date;
};

export type IcebreakerProfile = {
  profileID?: string;
  walletAddress: string;
  avatarUrl?: string;
  displayName?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  primarySkill?: string;
  networkingStatus?: string;
  channels?: IcebreakerChannel[];
  credentials?: IcebreakerCredential[];
  highlights?: IcebreakerHighlight[];
  workExperience?: IcebreakerWorkExperience[];
  events?: IcebreakerEvent[];
  guilds?: IcebreakerGuildMembership[];
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
