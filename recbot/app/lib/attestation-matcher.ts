import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import { getIcebreakerUserFromFCUser } from './utils';
import { IcebreakerUser } from './types';

export const attestationsAndSkills = [
  {
    schemaID: 'recbot:skill:product',
    name: 'Skill: Product',
  },
  {
    schemaID: 'recbot:skill:design',
    name: 'Skill: Design',
  },
  {
    schemaID: 'recbot:skill:engineering',
    name: 'Skill: Engineering',
  },
  {
    schemaID: 'recbot:skill:marketing',
    name: 'Skill: Marketing',
  },
  {
    schemaID: 'recbot:skill:legal',
    name: 'Skill: Legal',
  },
  {
    schemaID: 'recbot:skill:finance',
    name: 'Skill: Finance',
  },
  {
    schemaID: 'recbot:skill:operations',
    name: 'Skill: Operations',
  },
  {
    schemaID: 'recbot:skill:sales',
    name: 'Skill: Sales',
  },
  {
    schemaID: 'recbot:skill:support',
    name: 'Skill: Support',
  },
  {
    schemaID: 'recbot:skill:talent',
    name: 'Skill: Talent',
  },
  {
    schemaID: 'recbot:skill:data',
    name: 'Skill: Data',
  },
  // {
  //   schemaID: 'recbot:endorsement:qBuilder',
  //   name: 'qBuilder',
  // },
  {
    schemaID: 'recbot:endorsement:workedDirectlyWith',
    name: 'Worked directly with',
  },
];

export function hasCredential(credentialName?: string, credentials?: IcebreakerUser['credentials'], exact = false) {
  if (!credentials || !credentialName) {
    return false;
  }

  return credentials.some(({ name }) => (exact ? name === credentialName : name.startsWith(credentialName)));
}

export const isValidSkill = async(text: string, mentioned_profiles: User[]) => {
  const botUsername = 'rec';
  const match = text.match(new RegExp(`^@${botUsername} \\S+ (.+)$`));
  const mentionedUsernames = mentioned_profiles
    .map((profile) => profile.username)
    .filter((username) => username !== 'rec');

  const skill = match ? match[1] : '';
  const username = mentionedUsernames[0];
  const validSkill = attestationsAndSkills
    .map((skill) => skill.name)
    .includes(skill);
  const validUsername = mentionedUsernames.includes(username);
  const icebreakerUser = await getIcebreakerUserFromFCUser(username) as IcebreakerUser
  const userHasCredential = hasCredential(skill, icebreakerUser.credentials);
  const isValid = match && validSkill && validUsername && userHasCredential;

  if (isValid && match) {
    const returnObj = {
      mentionedUsername: mentionedUsernames[0],
      skill: match[1],
      isValid: isValid,
    };
    return returnObj;
  } else {
    return { mentionedUsername: '', skill: '', isValid: false };
  }
};
