import { type User } from '@neynar/nodejs-sdk/build/api';
import { getSchema } from './getSchema';
import { canFnameAttestToSchema } from './utils';
import { attestationSchemas } from './attestationSchemas';
import { type AttestationSchema } from './types';


type RecommendationDataResponse = {
  attesteeFname: string;
  schemaName: string;
  isValid: boolean;
  message: string;
};

export const getRecommendationData = async (
  text: string,
  mentioned_profiles: User[],
  authorFname: string,
  parentFname?: string
): Promise<RecommendationDataResponse> => {
  const botUsername = 'rec';
  const mentionedUsernames = mentioned_profiles
    .map((profile) => profile.username)
    .filter((username) => username !== botUsername);

  const attesteeFname = mentionedUsernames[0] || parentFname;

  if (!attesteeFname) {
    return { attesteeFname: '', schemaName: '', isValid: false, message: 'No attestee found' };
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

  console.log('Processing text:', text);

  if (!cleanText) {
    return { attesteeFname, schemaName: '', isValid: false, message: 'No text found' };
  }
  
  const { skill, message } = await getSchema(text);
  console.log('Schema result:', { skill, message });

  


  if (!skill) {
    return { attesteeFname, schemaName: cleanText, isValid: false, message};
  }

  const matchedSchema = attestationSchemas.find(
    (schema: AttestationSchema) => schema.name.toLowerCase() === skill.toLowerCase()
  );

  if (!matchedSchema) {
    return { attesteeFname, schemaName: skill, isValid: false, message};
  }

  const isValid = await canFnameAttestToSchema(authorFname, matchedSchema);

  return {
    attesteeFname,
    schemaName: skill,
    isValid,
    message,
  };
};
