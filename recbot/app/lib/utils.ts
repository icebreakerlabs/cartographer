import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';
import {
  type IcebreakerCredential,
  type AttestationSchema,
  type IcebreakerProfile,
  type User,
} from './types';

export const ICEBREAKER_API_URL = 'https://app.icebreaker.xyz/api';

export const ICEBREAKER_CREDENTIALS_URL =
  'https://app.icebreaker.xyz/credentials';
export const neynarClient = new NeynarAPIClient(
  new Configuration({
    apiKey: process.env.NEYNAR_API_KEY ?? '',
  })
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

export function hasCredential(
  credentialName?: string,
  credentials?: IcebreakerCredential[],
  exact = false
) {
  if (!credentials || !credentialName) {
    return false;
  }
  return credentials.some(({ name }) =>
    exact ? name === credentialName : name.startsWith(credentialName)
  );
}

export async function canFnameAttestToSchema(
  fname?: string,
  schema?: AttestationSchema
) {
  if (!fname || !schema) {
    return false;
  }

  const { isOpen, allowRecursion, requiredSchemaName, name, requiredFnames } =
    schema;

  if (isOpen) {
    return true;
  }
  if (requiredFnames) {
    return requiredFnames.some((f) => f.toLowerCase() === fname?.toLowerCase());
  }
  if (allowRecursion || requiredSchemaName) {
    const icebreakerProfile = await getIcebreakerProfileFromFname(fname);
    if (icebreakerProfile) {
      return hasCredential(
        requiredSchemaName ?? name,
        icebreakerProfile.credentials
      );
    }
  }
  return false;
}
