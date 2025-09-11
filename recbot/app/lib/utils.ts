import {
  type IcebreakerCredential,
  type AttestationSchema,
  type IcebreakerProfile,
  type User,
} from './types';

const WebhookUrls: Record<string, { webhookUrl: string; authHeader: string }> =
  {
    x: {
      webhookUrl: process.env.X_WEBHOOK_URL ?? '',
      authHeader: process.env.X_WEBHOOK_AUTH ?? '',
    },
    neynar: {
      webhookUrl: process.env.NEYNAR_WEBHOOK_URL ?? '',
      authHeader: process.env.NEYNAR_WEBHOOK_AUTH ?? '',
    },
  };

export const ICEBREAKER_API_URL = 'https://app.icebreaker.xyz/api';

export const ICEBREAKER_CREDENTIALS_URL =
  'https://app.icebreaker.xyz/credentials';

export const getEthAddressForUser = async (user: User) => {
  const icebreakerUser = await getIcebreakerProfileFromFname(user.username);
  return icebreakerUser?.walletAddress ?? '0x';
};

export const getEthAddressForFname = async (fname?: string) => {
  if (!fname) {
    return;
  }
  const icebreakerUser = await getIcebreakerProfileFromFname(fname);
  return icebreakerUser?.walletAddress ?? '0x';
};

type ProfileResponse = {
  profiles: IcebreakerProfile[];
};

export const getIcebreakerProfileFromFname = async (
  fname?: string
): Promise<IcebreakerProfile | undefined> => {
  if (!fname) {
    return;
  }
  try {
    const response = await fetch(`${ICEBREAKER_API_URL}/v1/fname/${fname}`);
    if (!response.ok) {
      throw new Error('Error fetching data for fname');
    }
    const json: ProfileResponse = await response.json();
    return json.profiles[0];
  } catch (err) {
    console.error(err);
    return;
  }
};

export const getIcebreakerProfileFromSocialPath = async (
  socialPath?: string
): Promise<IcebreakerProfile | undefined> => {
  if (!socialPath) {
    return;
  }

  try {
    const response = await fetch(`${ICEBREAKER_API_URL}/v1/${socialPath}`);
    if (!response.ok) {
      throw new Error(`Error fetching data for ${socialPath}`);
    }
    const json: ProfileResponse = await response.json();
    return json.profiles[0];
  } catch (err) {
    console.error(err);
    return;
  }
};

export function hasCredential(
  credentialName?: string,
  credentials?: IcebreakerCredential[],
  exact = false
) {
  if (!credentials || !credentialName) {
    return false;
  }
  return credentials.some(({ name }) =>
    exact ? name === credentialName : name.startsWith(credentialName)
  );
}

export async function canFnameAttestToSchema(
  fname?: string,
  schema?: AttestationSchema
) {
  if (!fname || !schema) {
    return false;
  }

  const { isOpen, allowRecursion, requiredSchemaName, name, requiredFnames } =
    schema;

  if (isOpen) {
    return true;
  }
  if (requiredFnames) {
    return requiredFnames.some((f) => f.toLowerCase() === fname?.toLowerCase());
  }
  if (allowRecursion || requiredSchemaName) {
    const icebreakerProfile = await getIcebreakerProfileFromFname(fname);
    if (icebreakerProfile) {
      return hasCredential(
        requiredSchemaName ?? name,
        icebreakerProfile.credentials
      );
    }
  }
  return false;
}

export async function canUsernameAttestToSchema(
  socialPath?: string,
  schema?: AttestationSchema
) {
  if (!socialPath || !schema) {
    return false;
  }

  const { isOpen, allowRecursion, requiredSchemaName, name, requiredFnames } =
    schema;

  if (isOpen) {
    return true;
  }
  if (requiredFnames) {
    return requiredFnames.some(
      (f) => f.toLowerCase() === socialPath?.toLowerCase()
    );
  }
  if (allowRecursion || requiredSchemaName) {
    const icebreakerProfile = await getIcebreakerProfileFromSocialPath(
      socialPath
    );
    if (icebreakerProfile) {
      return hasCredential(
        requiredSchemaName ?? name,
        icebreakerProfile.credentials
      );
    }
  }
  return false;
}

export async function publishToExternalWebhook(
  channelType: string,
  text: string,
  embeds: unknown[] = [],
  parent?: string
) {
  const { webhookUrl, authHeader } = WebhookUrls[channelType ?? ''];

  if (!webhookUrl || !authHeader) {
    throw new Error('External webhook URL and auth header are required');
  }

  const payload = {
    text,
    embeds,
    parent,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `External webhook failed with status: ${response.status}`
      );
    }

    return response;
  } catch (error) {
    console.error('Error publishing to external webhook:', error);
    throw error;
  }
}
