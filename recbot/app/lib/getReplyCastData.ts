import { ICEBREAKER_CREDENTIALS_URL } from './utils';

export function getReplyCastData(
  isValidRecommendation: boolean,
  schemaName?: string,
  isSuccess?: boolean
): { text: string; embeds?: { url: string }[] } {
  if (!isValidRecommendation || !schemaName) {
    return {
      text: schemaName
        ? `You must receive an endorsement for ${schemaName} before you can endorse others.`
        : 'Unable to endorse. Make sure to format with: (at)rec (at)<username> <endorsement>',
    };
  }

  const encodedCredentialName = encodeURIComponent(schemaName);
  const url = `${ICEBREAKER_CREDENTIALS_URL}/${encodedCredentialName}?show=receivers`;

  if (isSuccess) {
    return {
      text: `Success! Visit ${url} to view on Icebreaker.`,
      embeds: [{ url }],
    };
  } else {
    return {
      text: 'Beep boop. Something went wrong.',
    };
  }
}
