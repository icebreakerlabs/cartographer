import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import { getIcebreakerUserFromFCUser } from './utils';
import { IcebreakerUser } from './types';

export const attestationsAndSkills = [
  {
    schemaID: 'recbot:skill:product',
    name: 'Skill: Product',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:design',
    name: 'Skill: Design',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:engineering',
    name: 'Skill: Engineering',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:marketing',
    name: 'Skill: Marketing',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:legal',
    name: 'Skill: Legal',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:finance',
    name: 'Skill: Finance',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:operations',
    name: 'Skill: Operations',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:sales',
    name: 'Skill: Sales',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:support',
    name: 'Skill: Support',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:talent',
    name: 'Skill: Talent',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:skill:data',
    name: 'Skill: Data',
    allowRecursion: false,
  },
  // {
  //   schemaID: 'recbot:endorsement:qBuilder',
  //   name: 'qBuilder',
  //   allowRecursion: true,
  // },
  {
    schemaID: 'recbot:endorsement:workedDirectlyWith',
    name: 'Worked directly with',
    allowRecursion: false,
  },
  {
    schemaID: 'recbot:endorsement:human',
    name: 'Human',
    allowRecursion: true,
  },
];

export function hasCredential(credentialName?: string, credentials?: IcebreakerUser['credentials']) {
  if (!credentials || !credentialName) {
    return false;
  }

  const skill = attestationsAndSkills.find(skill => skill.name === credentialName);
  if (skill) {
    // If the skill isn't recursive, return true because anyone can do it  
    if (!skill.allowRecursion) {
      return true;
    }
  }

  // Otherwise, proceed to check if the user has the recursive credential
  return credentials.some(({ name }) => name.startsWith(credentialName));
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
  const icebreakerUser = await getIcebreakerUserFromFCUser(username)
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
