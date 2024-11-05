import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';

export const attestationsAndSkills = [
  {
    schemaID: '65', 
    name: 'Skill: Product'
  },
  {
    schemaID: '66', 
    name: 'Skill: Design'
  },
  {
    schemaID: '67', 
    name: 'Skill: Engineering'
  },
  {
    schemaID: '68', 
    name: 'Skill: Marketing'
  },
  {
    schemaID: '69', 
    name: 'Skill: Legal'
  },
  {
    schemaID: '70', 
    name: 'Skill: Finance'
  },
  {
    schemaID: '71', 
    name: 'Skill: Operations'
  },
  {
    schemaID: '72', 
    name: 'Skill: Sales'
  },
  {
    schemaID: '73', 
    name: 'Skill: Support'
  },
  {
    schemaID: '74', 
    name: 'Skill: Talent'
  },
  {
    schemaID: '75', 
    name: 'Skill: Data'
  },
  {
    schemaID: '20', 
    name: 'qBuilder',
  },
];

export const isValidSkill = (text: string, mentioned_profiles: User[]) => {
  const botUsername = 'rec';
  const match = text.match(new RegExp(`^@${botUsername} \\S+ (.+)$`));
  const mentionedUsernames = mentioned_profiles.map(
    (profile) => profile.username
  ).filter((username) => username !== 'rec');

  const skill = match ? match[1] : '';
  const username = mentionedUsernames[0];
  const validSkill = attestationsAndSkills.map((skill) => skill.name).includes(skill);
  const validUsername = mentionedUsernames.includes(username);
  const isValid = match && validSkill && validUsername;

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
