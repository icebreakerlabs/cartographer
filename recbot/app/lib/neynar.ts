import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY ?? '',
  baseOptions: {
    headers: {
      "x-neynar-experimental": true,
    },
  },
});
  
export const neynar = new NeynarAPIClient(config);

export async function getSignerUuid() {
  try {
    const signer = await neynar.createSigner();

    return signer.signer_uuid;
  } catch {
    return process.env.NEYNAR_SIGNER_UUID ?? '';
  }
}
