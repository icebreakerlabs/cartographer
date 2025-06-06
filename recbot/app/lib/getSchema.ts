import { attestationSchemas } from './attestationSchemas';
import { type AttestationSchema } from './types';
import { timeout } from './promises';

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config();

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;
const LLM_DEFAULT_TIMEOUT = 10000;
const DEFAULT_MODEL: Parameters<typeof openai>[0] = 'gpt-4o';
const SYSTEM_PROMPT = `
You are an expert at extracting skill endorsements from text.  
You are given a list of possible skill schema names (schemaNameString), each starting with "Skill:".  
Your job is to analyze the provided text and determine which, if any, of these skills are being positively recommended or endorsed.
`;



function getPromptTemplate(schemaNamesString: string, cleanText: string) {
  return `
    Instructions:
    - Only consider skills from the provided schemaNamesString that start with "Skill:".
    - If the text contains a positive recommendation or endorsement for one of these skills, return the exact name of the skill as they appear in schemaNameString(e.g. "Skill: Engineering").
    - If the text does not contain a positive recommendation for any of the skills, return 'undefined'.
    - Do not return skills that are not positively recommended.
    - Do not return any skills that are not in the schemaNameString.
    - Ignore negative statements or criticisms about skills.

    schemaNamesString: ${schemaNamesString}
    text: ${cleanText}
  `;
}

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

export async function getSchema(cleanText: string): Promise<AttestationSchema | undefined> {
  const llmResult = await askAI(
    SYSTEM_PROMPT, 
    getPromptTemplate(
      attestationSchemas
        .flatMap(({ name }) => name.startsWith('Skill:') ? name : [])
        .join(', '),
      cleanText
    )
  );

  const schemaName = llmResult?.trim();
  const matchedSchema = attestationSchemas.find(
    ({ name }) => name.toLowerCase() === schemaName.toLowerCase()
  );

  if (matchedSchema) {
    return matchedSchema;
  }

  return cleanText.startsWith('bot')
    ? attestationSchemas.find((schema) => schema.name === 'Feather Ice')
    : ICE_CREAM_PATTERN.test(cleanText)
    ? attestationSchemas.find((schema) => schema.name === 'Ice cream')
    : attestationSchemas.find((schema) =>
        cleanText.includes(schema.name.toLowerCase())
      );
}
