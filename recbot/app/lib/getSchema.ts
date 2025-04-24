import { type AttestationSchema } from './types';
import { attestationSchemas } from './attestationSchemas';

const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;

export function getSchema(cleanText: string): AttestationSchema | undefined {
  // TODO: Add LLM lookup for fuzzy matching

  return cleanText.startsWith('bot')
    ? attestationSchemas.find((schema) => schema.name === 'Feather Ice')
    : ICE_CREAM_PATTERN.test(cleanText)
    ? attestationSchemas.find((schema) => schema.name === 'Ice cream')
    : attestationSchemas.find((schema) =>
        cleanText.includes(schema.name.toLowerCase())
      );
}
