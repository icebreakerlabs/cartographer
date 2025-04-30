import { ICEBREAKER_CREDENTIALS_URL } from './utils';

export function getReplyCastData(
  isValidRecommendation: boolean,
  schemaName?: string,
  requiredSchemaName?: string,
  isSuccess?: boolean
): { text: string; embeds?: { url: string }[] } {
  if (!isValidRecommendation || !schemaName) {
    return {
      text: schemaName
        ? `Oops! You must receive an endorsement for ${
            requiredSchemaName ?? schemaName
          } before you can endorse others.`
        : 'Unable to endorse. Make sure to format with: (at)rec (at)<username> <endorsement>',
    };
  }

  const encodedCredentialName = encodeURIComponent(schemaName);
  const url = `${ICEBREAKER_CREDENTIALS_URL}/${encodedCredentialName}?show=receivers`;

  if (isSuccess) {
    switch (schemaName) {
      case 'Ice cream':
        return {
          text: `🍦 success! Visit https://icebreaker.xyz/farcon2025 to view on Icebreaker.`,
        };
      default:
        return {
          text: `Success! Visit ${url} to view on Icebreaker.`,
          embeds: [{ url }],
        };
    }
  } else {
    return {
      text: 'Beep boop. Something went wrong.',
    };
  }
}
