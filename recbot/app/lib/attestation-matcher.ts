import { type User } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import { getIcebreakerProfileFromFname } from './utils';
import { type AttestationSchema, type IcebreakerCredential } from './types';

export const attestationsSchemas = [
  {
    schemaID: 'recbot:skill:product',
    name: 'Skill: Product',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:design',
    name: 'Skill: Design',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:engineering',
    name: 'Skill: Engineering',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:marketing',
    name: 'Skill: Marketing',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:legal',
    name: 'Skill: Legal',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:finance',
    name: 'Skill: Finance',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:operations',
    name: 'Skill: Operations',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:sales',
    name: 'Skill: Sales',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:support',
    name: 'Skill: Support',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:talent',
    name: 'Skill: Talent',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:data',
    name: 'Skill: Data',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:endorsement:qBuilder',
    name: 'qBuilder',
    isOpen: false,
    allowRecursion: true,
  },
  {
    schemaID: 'recbot:endorsement:workedDirectlyWith',
    name: 'Worked directly with',
    isOpen: true,
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:endorsement:human',
    name: 'Human',
    isOpen: false,
    allowRecursion: true,
  },
  {
    schemaID: 'recbot:endorsement:featherIce',
    name: 'Feather Ice',
    isOpen: false,
    allowRecursion: false,
    requiredSchemaName: 'qBuilder',
  },
  {
    schemaID: 'recbot:endorsement:bro',
    name: 'bro',
    isOpen: false,
    allowRecursion: true,
  },
  {
    schemaID: 'recbot:endorsement:chones',
    name: 'Chones',
    isOpen: false,
    allowRecursion: true,
  },
] as AttestationSchema[];

function hasCredential(
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

async function canFnameAttestToSchema(
  fname?: string,
  schema?: AttestationSchema
) {
  if (!fname || !schema) {
    return false;
  }

  const { isOpen, allowRecursion, requiredSchemaName, name } = schema;

  if (isOpen) {
    return true;
  }
  if (allowRecursion || requiredSchemaName) {
    const icebreakerProfile = await getIcebreakerProfileFromFname(fname);
    if (icebreakerProfile) {
      const icebreakerProfileHasRequiredCredential = hasCredential(
        requiredSchemaName ?? name,
        icebreakerProfile.credentials
      );
      return icebreakerProfileHasRequiredCredential;
    }
  }
  return false;
}

export const isValidRec = async (
  text: string,
  mentioned_profiles: User[],
  authorFname: string
) => {
  const botUsername = 'rec';
  const match = text.match(new RegExp(`^@${botUsername} @(\\S+) (.+)$`));
  const mentionedUsernames = mentioned_profiles
    .map((profile) => profile.username)
    .filter((username) => username !== 'rec');

  const fname = mentionedUsernames[0];
  const recContent = match ? match[2] : '';
  const matchedSchema = recContent.toLowerCase().startsWith('bot')
    ? attestationsSchemas.find((schema) => schema.name === 'Feather Ice')
    : attestationsSchemas.find((schema) => recContent.includes(schema.name));

  if (matchedSchema) {
    const isValid = await canFnameAttestToSchema(authorFname, matchedSchema);
    const returnObj = {
      mentionedUsername: fname,
      schemaName: matchedSchema.name,
      isValid,
    };
    return returnObj;
  } else {
    return { mentionedUsername: fname, schemaName: '', isValid: false };
  }
};
