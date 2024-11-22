import { IcebreakerProfile } from './types';

export const ICEBREAKER_API_URL = 'https://app.icebreaker.xyz/api';
export const NEYNAR_API_URL = 'https://api.neynar.com';

// export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const BASE_URL = 'https://cartographer-mini-app.vercel.app';

export const credentials = [
  'qBuilder',
  'Human',
  'bro',
  'Chones',
  'Skill: Product',
  'Skill: Design',
  'Skill: Engineering',
  'Skill: Marketing',
  'Skill: Legal',
  'Skill: Finance',
  'Skill: Operations',
  'Skill: Sales',
  'Skill: Support',
  'Skill: Talent',
  'Skill: Data',
];

export const ICEBREAKER_CREDENTIALS_URL =
  'https://app.icebreaker.xyz/credentials';

type ProfileResponse = {
  profiles: IcebreakerProfile[];
};

export const getIcebreakerProfileFromEthAddress = async (
  address?: string
): Promise<IcebreakerProfile | undefined> => {
  if (!address) {
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/api/eth?address=${address}`);
    if (!response.ok) {
      throw new Error('Error fetching data for address');
    }
    const json: ProfileResponse = await response.json();
    return json.profiles[0];
  } catch (err) {
    console.error(err);
    return;
  }
};

export const getIcebreakerProfileFromFname = async (
  fname?: string
): Promise<IcebreakerProfile | undefined> => {
  if (!fname) {
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/api/fname?fname=${fname}`);
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
