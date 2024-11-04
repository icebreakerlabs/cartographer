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
  );
  const isValid =
    match &&
    attestationsAndSkills.includes(match[1]) &&
    mentionedUsernames.includes(match[0])
      ? true
      : false;
  if (isValid && match) {
    return {
      mentionedUsername: match[0],
      skill: match[1],
      isValid: isValid,
    };
  } else {
    return { isValid: isValid };
  }
};
