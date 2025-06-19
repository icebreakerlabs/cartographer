import { attestationSchemas } from './attestationSchemas';
import { type AttestationSchema } from './types';



const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;

// New function to call the local API service
async function callAttestationSchemaAPI(text: string): Promise<AttestationSchema | undefined> {
  try {
    const response = await fetch('https://agent-production-ba4b.up.railway.app/get_attestation_schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    const schemaName = data.attestation_schema || data;
    
    // If we got a string, look up the actual schema object
    if (typeof schemaName === 'string') {
      return attestationSchemas.find(
        (schema) => schema.name.toLowerCase() === schemaName.toLowerCase()
      );
    }
    
    // If we got an object, return it directly
    return schemaName;
  } catch (error) {
    console.error('Error calling attestation schema API:', error);
    return undefined;
  }
}

export async function getSchema(cleanText: string): Promise<AttestationSchema | undefined> {
  // First try the API call
  const apiResult = await callAttestationSchemaAPI(cleanText);
  if (apiResult) {
    return apiResult;
  }



  return cleanText.startsWith('bot')
    ? attestationSchemas.find((schema) => schema.name === 'Feather Ice')
    : ICE_CREAM_PATTERN.test(cleanText)
    ? attestationSchemas.find((schema) => schema.name === 'Ice cream')
    : attestationSchemas.find((schema) =>
        cleanText.includes(schema.name.toLowerCase())
      );
}


