const RAILWAY_API_URL = process.env.ICEBREAKER_AGENT_API_ENDPOINT;

type LLMResponse = string | { schemaName: string };

export async function getLLMSchema(text: string) {
  if (!RAILWAY_API_URL) {
    throw new Error('ICEBREAKER_AGENT_API_ENDPOINT is not set');
  }

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
    const data: LLMResponse = await response.json();
    if (typeof data === 'string') {
      return;
    }
    return data.schemaName;
  } catch (error) {
    console.error('Error calling attestation schema API:', error);
  }
}
