import { type User } from '@neynar/nodejs-sdk/build/api';
import { getSchema } from './getSchema';
import { canFnameAttestToSchema } from './utils';
import { attestationSchemas } from './attestationSchemas';
import { type AttestationSchema } from './types';

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
    return { attesteeFname: '', schemaName: 'b', isValid: false };
  }
  const mentionedUsernames = mentioned_profiles
    .map((profile) => profile.username)
    .filter((username) => username !== botUsername);

  const attesteeFname = mentionedUsernames[0] || parentFname;

  if (!attesteeFname) {
    return { attesteeFname: '', schemaName: '', isValid: false };
  }

  const usernamesToRemove = [...mentionedUsernames, botUsername].map(
    (username) => `@${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
  );
  
  const usernamesRegex = new RegExp(usernamesToRemove.join('|'), 'gi');
  const cleanText = text
    .replace(usernamesRegex, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();

  if (!cleanText) {
    return { attesteeFname, schemaName: '', isValid: false };
  }

  const { skill } = await getSchema(cleanText);

  if (!skill) {
    return { attesteeFname, schemaName: cleanText, isValid: false };
  }

  const matchedSchema = attestationSchemas.find(
    (schema: AttestationSchema) => schema.name.toLowerCase() === skill.toLowerCase()
  );

  if (!matchedSchema) {
    return { attesteeFname, schemaName: skill, isValid: false };
  }

  const isValid = await canFnameAttestToSchema(authorFname, matchedSchema);

  return {
    attesteeFname,
    schemaName: skill,
    isValid,
  };
};
