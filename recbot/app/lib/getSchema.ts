import { type AttestationSchema } from './types';
import { attestationSchemas } from './attestationSchemas';

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

import dotenv from 'dotenv';
dotenv.config();


import { timeout } from './promises';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const LLM_DEFAULT_TIMEOUT = 10000;
const DEFAULT_MODEL: Parameters<typeof openai>[0] = 'gpt-4o';

// copied from llms.ts in cobalt
export async function askAI(
  systemPrompt: string,
  prompt: string,
  timeoutMs = LLM_DEFAULT_TIMEOUT,
  model = DEFAULT_MODEL,
) {
  try {
    const { text } = await timeout(
      generateText({
        model: openai(model),
        system: systemPrompt,
        prompt,
        temperature: 0.7,
        maxTokens: 5000,
      }),
      timeoutMs,
    );

    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    return '';
  }
}


export async function generateSimpleSearchQuery(cleanText: string) {
  /*
  async function that determines the schema name from the provided text.
  currently, will return any valid matching schema name, including non-skills. 
  Issue: @rec bot @alice has terrible Engineering abilities! 
  should return 'undefined'
  */

  return askAI(
    `
      You're job is to determine the schema name from the provided text.
      The schema name should be a single word.
      The schema name should be a valid schema name from the attestationSchemas array.
      The schema name should be the most relevant schema name for the provided text.
      The schema name should be the most specific schema name for the provided text.
      The schema name should be the most accurate schema name for the provided text.
      If the text is not a valid schema name, return 'undefined'.
    `,
    '<attestionSchemas>' + JSON.stringify(attestationSchemas) + '</attestionSchemas> <text>' + cleanText + '</text>',
  );
}

const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;

export async function getSchema(cleanText: string): Promise<AttestationSchema | undefined> {
  const llmResult = await generateSimpleSearchQuery(cleanText);
  const schemaName = llmResult?.trim();

  let matchedSchema = undefined;
  if (schemaName && schemaName !== 'undefined') {
    matchedSchema = attestationSchemas.find(
      (schema) => schema.name.toLowerCase() === schemaName.toLowerCase()
    );
  }

  // Fallback logic if LLM didn't find a schema
  if (!matchedSchema) {
    matchedSchema = cleanText.startsWith('bot')
      ? attestationSchemas.find((schema) => schema.name === 'Feather Ice')
      : ICE_CREAM_PATTERN.test(cleanText)
      ? attestationSchemas.find((schema) => schema.name === 'Ice cream')
      : attestationSchemas.find((schema) =>
          cleanText.includes(schema.name.toLowerCase())
        );
  }

  return matchedSchema;
}
