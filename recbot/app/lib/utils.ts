import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';

export const ICEBREAKER_API_URL = 'https://app.icebreaker.xyz/api';

export const ICEBREAKER_CREDENTIALS_URL =
  'https://app.icebreaker.xyz/credentials';
export const neynarClient = new NeynarAPIClient(
  process.env.NEYNAR_API_KEY ?? ''
);

export const getEthAddressForUser = (user: User) => {
  if (user.verified_addresses.eth_addresses.length) {
    return user.verified_addresses.eth_addresses[0];
  } else {
    return user.custody_address;
  }
};
