/* eslint-disable @typescript-eslint/no-explicit-any */

export type WebhookData = {
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