import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import { IcebreakerProfile } from './types';

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

export const getIcebreakerProfileFromFname = async (
  fname: string
): Promise<IcebreakerProfile> => {
  if (fname) {
    const response = await fetch(
      `${ICEBREAKER_API_URL}/api/fname?fname=${fname}`
    );
    if (!response.ok) {
      throw new Error('Error fetching data for fname');
    }
    const json = await response.json();
    return json.profiles[0];
  } else {
    throw new Error('No fname or fid for the user provided');
  }
};
