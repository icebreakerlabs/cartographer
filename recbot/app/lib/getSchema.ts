import { attestationSchemas } from './attestationSchemas';

type AttestationResponse = {
  skill?: string | { name: string };
  bot_response: string;
};

const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;
const RAILWAY_API_URL = 'https://agent-agent-pr-17.up.railway.app/get_attestation_schema';

async function getAttestationSkillAndMessage(text: string): Promise<{
  skill: string | undefined;
  message: string;
}> {
  try {
    const response = await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data: AttestationResponse = await response.json();

    if (!data.skill) {
      return {
        skill: undefined,
        message: data.bot_response || ''
      };
    }
    
    if (typeof data.skill === 'string') {
      return {
        skill: data.skill,
        message: data.bot_response
      };
    }

    return {
      skill: data.skill.name,
      message: data.bot_response
    };
  } catch (error) {
    console.error('Error calling attestation schema API:', error);
    return {
      skill: undefined,
      message: ''
    };
  }
}

export async function getSchema(cleanText: string) {
  const skillAndMessage = await getAttestationSkillAndMessage(cleanText);

  if (skillAndMessage) {
    return skillAndMessage;
  }

  if (cleanText.startsWith('bot')) {
    return {
      skill: 'Feather Ice',
      message: 'Found skill: Feather Ice'
    };
  }

  if (ICE_CREAM_PATTERN.test(cleanText)) {
    return {
      skill: 'Ice cream',
      message: 'Found skill: Ice cream'
    };
  }

  const skill = attestationSchemas.find((schema) =>
    cleanText.includes(schema.name.toLowerCase())
  );

  if (skill) {
    return {
      skill: skill.name,
      message: `Found skill: ${skill.name}`
    };
  }

  return {
    skill: undefined,
    message: 'No skill found'
  };
}

