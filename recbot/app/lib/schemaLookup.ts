import { type AttestationSchema } from './types';
import { attestationSchemas } from './attestationSchemas';

const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;

export function findMatchingSchema(
  cleanText: string
): AttestationSchema | undefined {
  return ICE_CREAM_PATTERN.test(cleanText)
    ? attestationSchemas.find(
        (schema: AttestationSchema) => schema.name === 'Feather Ice'
      )
    : attestationSchemas.find((schema: AttestationSchema) =>
        cleanText.includes(schema.name.toLowerCase())
      );
}
