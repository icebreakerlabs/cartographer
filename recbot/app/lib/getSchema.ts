import { attestationSchemas } from './attestationSchemas';
import { getLLMSchema } from './getLlmSchema';

export async function getSchema(cleanText: string) {
  const matchedSchema = cleanText.startsWith('bot')
    ? attestationSchemas.find((schema) => schema.name === 'Feather Ice')
    : attestationSchemas.find((schema) =>
        cleanText.includes(schema.name.toLowerCase())
      );

  if (matchedSchema) {
    return matchedSchema;
  }

  const llmSchema = await getLLMSchema(cleanText);

  if (llmSchema) {
    return attestationSchemas.find(
      (schema) => schema.name.toLowerCase() === llmSchema.toLowerCase()
    );
  }
}
