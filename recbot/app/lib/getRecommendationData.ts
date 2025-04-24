import { type User } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import { getSchema } from './getSchema';
import { canFnameAttestToSchema } from './utils';

type RecommendationDataResponse = {
  attesteeFname: string;
  schemaName: string;
  isValid: boolean;
};

export const getRecommendationData = async (
  text: string,
  mentioned_profiles: User[],
  authorFname: string,
  parentFname?: string
): Promise<RecommendationDataResponse> => {
  const botUsername = 'rec';
  const startsWithBot = text.startsWith(`@${botUsername}`);
  if (!startsWithBot) {
    return { attesteeFname: '', schemaName: '', isValid: false };
  }
  const mentionedUsernames = mentioned_profiles
    .map((profile) => profile.username)
    .filter((username) => username !== botUsername);

  const attesteeFname = mentionedUsernames[0] || parentFname;

  if (!attesteeFname) {
    return { attesteeFname: '', schemaName: '', isValid: false };
  }

  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const usernamesToRemove = [...mentionedUsernames, botUsername].map(
    (username) => `@${escapeRegex(username)}`
  );
  // Create regex to filter out usernames
  const usernamesRegex = new RegExp(usernamesToRemove.join('|'), 'gi');
  const cleanText = text
    .replace(usernamesRegex, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();

  if (!cleanText) {
    return { attesteeFname, schemaName: '', isValid: false };
  }
  const matchedSchema = getSchema(cleanText);

  if (matchedSchema) {
    const isValid = await canFnameAttestToSchema(authorFname, matchedSchema);
    return {
      attesteeFname,
      schemaName: matchedSchema.name,
      isValid,
    };
  }
  return { attesteeFname, schemaName: '', isValid: false };
};
