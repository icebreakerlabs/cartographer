import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import { IcebreakerProfile } from './types';

export const ICEBREAKER_API_URL = 'https://app.icebreaker.xyz/api';

export const ICEBREAKER_CREDENTIALS_URL =
  'https://app.icebreaker.xyz/credentials';
export const neynarClient = new NeynarAPIClient(
  process.env.NEYNAR_API_KEY ?? ''
);

export const getEthAddressForUser = async (user: User) => {
  const icebreakerUser = await getIcebreakerProfileFromFname(user.username);
  return icebreakerUser?.walletAddress ?? '0x';
};

export const getEthAddressForFname = async (fname?: string) => {
  if (!fname) {
    return;
  }
  const icebreakerUser = await getIcebreakerProfileFromFname(fname);
  return icebreakerUser?.walletAddress ?? '0x';
};

type ProfileResponse = {
  profiles: IcebreakerProfile[];
};

export const getIcebreakerProfileFromFname = async (
  fname?: string
): Promise<IcebreakerProfile | undefined> => {
  if (!fname) {
    return;
  }
  try {
    const response = await fetch(`${ICEBREAKER_API_URL}/v1/fname/${fname}`);
    if (!response.ok) {
      throw new Error('Error fetching data for fname');
    }
    const json: ProfileResponse = await response.json();
    return json.profiles[0];
  } catch (err) {
    console.error(err);
    return;
  }
};
