import { attestationSchemas } from './attestationSchemas';

// Define the new response type
interface AttestationResponse {
  skill: string | undefined;
  bot_response: string;
}

const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;

// New function to call the local API service
async function callAttestationSchemaAPI(text: string): Promise<AttestationResponse | undefined> {
  try {
    const response = await fetch('http://127.0.0.1:8000/get_attestation_schema', {
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
    
    // Handle the new response format
    if (data.skill && typeof data.skill === 'string') {
      // If skill is a string, return it directly
      return {
        skill: data.skill,
        bot_response: data.bot_response || ''
      };
    }
    
    // If skill is an object, extract the name
    if (data.skill && typeof data.skill === 'object' && data.skill.name) {
      return {
        skill: data.skill.name,
        bot_response: data.bot_response || ''
      };
    }
    
    // If skill is undefined or null
    return {
      skill: undefined,
      bot_response: data.bot_response || ''
    };
  } catch (error) {
    console.error('Error calling attestation schema API:', error);
    return undefined;
  }
}

export async function getSchema(cleanText: string): Promise<AttestationResponse> {
  // First try the API call
  const apiResult = await callAttestationSchemaAPI(cleanText);
  if (apiResult) {
    return apiResult;
  }

  // Fallback logic - create response format manually
  let skillName: string | undefined;
  
  if (cleanText.startsWith('bot')) {
    const skill = attestationSchemas.find((schema) => schema.name === 'Feather Ice');
    skillName = skill?.name;
  } else if (ICE_CREAM_PATTERN.test(cleanText)) {
    const skill = attestationSchemas.find((schema) => schema.name === 'Ice cream');
    skillName = skill?.name;
  } else {
    const skill = attestationSchemas.find((schema) =>
      cleanText.includes(schema.name.toLowerCase())
    );
    skillName = skill?.name;
  }

  return {
    skill: skillName,
    bot_response: skillName ? `Found skill: ${skillName}` : 'No skill found'
  };
}

getSchema('charlie is great at engineering').then(console.log)

