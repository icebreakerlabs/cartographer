import { type User } from './types';
import { getSchema } from './getSchema';
import { canFnameAttestToSchema, canUsernameAttestToSchema } from './utils';

const botUsernames: Record<string, string> = {
  x: 'icebreaker-rec',
  farcaster: 'rec',
};

type RecommendationDataResponse = {
  attesteeUsername: string;
  schemaName: string;
  isValid: boolean;
};

export const getRecommendationData = async (
  text: string,
  mentioned_profiles: User[],
  authorFname: string,
  parentFname?: string,
  botUsername = 'rec'
): Promise<RecommendationDataResponse> => {
  const startsWithBot = text.startsWith(`@${botUsername}`);
  if (!startsWithBot) {
    return { attesteeUsername: '', schemaName: '', isValid: false };
  }
  const mentionedUsernames = mentioned_profiles
    .map((profile) => profile.username)
    .filter((username) => username !== botUsername);

  const attesteeUsername = mentionedUsernames[0] || parentFname;

  if (!attesteeUsername) {
    return { attesteeUsername: '', schemaName: '', isValid: false };
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
    return { attesteeUsername, schemaName: '', isValid: false };
  }
  const matchedSchema = await getSchema(cleanText);

  if (matchedSchema) {
    const isValid = await canFnameAttestToSchema(authorFname, matchedSchema);
    return {
      attesteeUsername,
      schemaName: matchedSchema.name,
      isValid,
    };
  }
  return { attesteeUsername, schemaName: '', isValid: false };
};

export const getPostRecommendationData = async (
  channelType: string,
  text: string,
  mentioned_usernames: string[],
  authorUsername: string,
  parentAuthorUsername?: string
): Promise<RecommendationDataResponse> => {
  const botUsername = botUsernames[channelType ?? ''];
  const startsWithBot = text.startsWith(`@${botUsername}`);
  if (!startsWithBot) {
    return { attesteeUsername: '', schemaName: '', isValid: false };
  }

  const filteredUsernames = mentioned_usernames.filter(
    (username) => username !== botUsername
  );
  const attesteeUsername = filteredUsernames[0] || parentAuthorUsername;

  if (!attesteeUsername) {
    return { attesteeUsername: '', schemaName: '', isValid: false };
  }

  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const usernamesToRemove = [...filteredUsernames, botUsername].map(
    (username) => `@${escapeRegex(username)}`
  );

  const usernamesRegex = new RegExp(usernamesToRemove.join('|'), 'gi');
  const cleanText = text
    .replace(usernamesRegex, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();

  if (!cleanText) {
    return { attesteeUsername, schemaName: '', isValid: false };
  }

  const matchedSchema = await getSchema(cleanText);

  if (matchedSchema) {
    const isValid = await canUsernameAttestToSchema(
      `${channelType}/${authorUsername}`,
      matchedSchema
    );
    return {
      attesteeUsername,
      schemaName: matchedSchema.name,
      isValid,
    };
  }
  return { attesteeUsername, schemaName: '', isValid: false };
};
