jest.mock('@neynar/nodejs-sdk', () => ({
  NeynarAPIClient: jest.fn().mockImplementation(() => ({
    fetchBulkUsers: jest.fn().mockResolvedValue({ users: [{ username: 'alice' }] }),
    publishCast: jest.fn().mockResolvedValue({}),
  })),
}));

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getEthAddressForFname: jest.fn().mockResolvedValue('0xabc'),
  getEthAddressForUser: jest.fn().mockResolvedValue('0x123'),
}));

import { getSchema } from '../getSchema';
import { attestationSchemas } from '../attestationSchemas';
import { extractEndorsementFromCast } from '../webhook';
import type { WebhookData } from '../types';
import { getRecommendationData } from '../getRecommendationData';


// test webhook
const webhook = {
  type: 'cast.created',
  created_at: Date.now(),
  data: {
    object: "cast",
    hash: "somecastuniquehash",
    thread_hash: "somecastuniquehash",
    parent_hash: null,
    parent_url: null,
    root_parent_url: null,
    text: "@rec bot @alice has terrible Engineering abilities!",
    mentioned_profiles: [
      {
        object: "user",
        fid: 123,
        username: "alice",
        custody_address: "0xabc",
        profile: { bio: { text: "I am a software engineer", mentioned_profiles: [] } },
        follower_count: 0,
        following_count: 0,
        verifications: [],
        verified_addresses: { eth_addresses: [], sol_addresses: [] },
        verified_accounts: [],
        power_badge: false
      }
    ],
    author: {
      object: "user",
      fid: 456,
      username: "bob",
      custody_address: "0x123",
      profile: { bio: { text: "I am a software engineer", mentioned_profiles: [] } },
      follower_count: 0,
      following_count: 0,
      verifications: [],
      verified_addresses: { eth_addresses: [], sol_addresses: [] },
      verified_accounts: [],
      power_badge: false
    },
    parent_author: {
      fid: 123,
      // username isn't generally present under parent_author, but it is here for testing
      username: "alice"
    } as any,
    timestamp: new Date().toISOString(),
    event_timestamp: new Date().toISOString(),
    embeds: [],
    reactions: { likes_count: 0, recasts_count: 0, likes: [], recasts: [] },
    recasts: [],
    watches: [],
    replies: { count: 0 },
    deleted: false,
    channel: null
  }
} as WebhookData;


// test extractEndorsementFromCast
describe('extractEndorsementFromCast', () => {
  it('should process a webhook without making real API calls', async () => {
    const result = await extractEndorsementFromCast(webhook);
    expect(result).toBeUndefined();
    const { neynarClient } = require('../utils');
    expect(neynarClient.fetchBulkUsers).toHaveBeenCalled();
  });
});

// test getRecommendationData
describe('getRecommendationData', () => {
  it('should extract recommendation data from webhook', async () => {
    const text = webhook.data.text;
    const mentioned_profiles = webhook.data.mentioned_profiles;
    const authorFname = webhook.data.author.username;
    const parentFname = (webhook.data.parent_author as any).username;

    const result = await getRecommendationData(
      text,
      mentioned_profiles,
      authorFname,
      parentFname
    );

    console.log(result);
    // Add assertions here, e.g.:
    // expect(result).toEqual({ ...expectedResult });
  });
});

