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
    
    // Handle the new response format
    if (data.skill && typeof data.skill === 'string') {
      // If skill is a string, return it directly
      return {
        skill: data.skill,
        bot_response: data.bot_response || ''
      };
    }
    
    // If skill is not a string (could be object, null, undefined, etc.)
    if (data.skill && typeof data.skill !== 'string') {
      // If it's an object with a name property, extract the name
      if (typeof data.skill === 'object' && data.skill.name) {
        return {
          skill: data.skill.name,
          bot_response: data.bot_response || ''
        };
      }
      // For other non-string values (null, undefined, etc.), return undefined
      return {
        skill: undefined,
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
    skillName = 'Feather Ice';
  } else if (ICE_CREAM_PATTERN.test(cleanText)) {
    skillName = 'Ice cream';
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

