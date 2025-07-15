import { ICEBREAKER_CREDENTIALS_URL } from './utils';

export function getReplyCastData(
  isValidRecommendation: boolean,
  schemaName?: string,
  requiredSchemaName?: string,
  isSuccess?: boolean,
  message?: string
): { text: string; embeds?: { url: string }[] } {
  if (requiredSchemaName && !isSuccess) {
    return {
      text: `Oops! You must receive an endorsement for ${requiredSchemaName} before you can endorse others.`,
    };
  }

  if (!isValidRecommendation || !schemaName) {
    return {
      text: message ?? 'Beep boop. Something went wrong.',
    };
  }

  const encodedCredentialName = encodeURIComponent(schemaName);
  const url = `${ICEBREAKER_CREDENTIALS_URL}/${encodedCredentialName}?show=receivers`;
  console.log('schemaName:', schemaName);
  console.log('isSuccess:', isSuccess)
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
