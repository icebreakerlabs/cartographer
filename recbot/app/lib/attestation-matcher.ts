import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';

export const attestationsAndSkills = [
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
  'qBuilder',
];

export const isValidSkill = (text: string, mentioned_profiles: User[]) => {
  const botUsername = 'rec';
  const match = text.match(new RegExp(`^@${botUsername} \\S+ (.+)$`));
  const mentionedUsernames = mentioned_profiles.map(
    (profile) => profile.username
  ).filter((username) => username !== 'rec');

  const skill = match ? match[1] : '';
  const username = mentionedUsernames[0];
  const validSkill = attestationsAndSkills.includes(skill);
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
