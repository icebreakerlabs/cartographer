/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type ProcessBodyObject,
  type IcebreakerStoreCredentialsParams,
} from './types';
import {
  getIcebreakerProfileFromSocialPath,
  ICEBREAKER_API_URL,
  publishToExternalWebhook,
} from './utils';
import { getPostRecommendationData } from './getRecommendationData';
import { attestationSchemas } from './attestationSchemas';
import { getReplyPostData } from './getReplyPostData';
import { createHmac } from 'node:crypto';

export async function extractEndorsementFromPost({
  text,
  mentionedUsernames,
  authorUsername,
  parentAuthorUsername,
  channelType,
  postId,
  timestamp,
}: ProcessBodyObject) {
  const { isValid, attesteeUsername, schemaName } =
    await getPostRecommendationData(
      channelType,
      text,
      mentionedUsernames,
      authorUsername,
      parentAuthorUsername ?? undefined
    );

  const schema = attestationSchemas.find(
    (schema) => schema.name === schemaName
  );

  if (isValid) {
    const [attesterProfile, attesteeProfile] = await Promise.all([
      getIcebreakerProfileFromSocialPath(`${channelType}/${authorUsername}`),
      getIcebreakerProfileFromSocialPath(`${channelType}/${attesteeUsername}`),
    ]);

    if (!attesterProfile?.walletAddress || !attesteeProfile?.walletAddress) {
      throw new Error('Attester or attestee address not found');
    }

    const json: IcebreakerStoreCredentialsParams = {
      attesterAddress: attesterProfile.walletAddress,
      attesteeAddress: attesteeProfile.walletAddress,
      isPublic: true,
      name: schemaName,
      schemaID: schema?.id ?? '-1',
      source: channelType,
      reference: postId,
      timestamp: timestamp,
      uid: `0x${createHmac('sha256', postId).digest('hex')}`,
    };

    try {
      const response = await fetch(`${ICEBREAKER_API_URL}/v1/credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ICEBREAKER_BEARER_TOKEN}`,
        },
        body: JSON.stringify(json),
      });

      const replyPostData = getReplyPostData(
        isValid,
        schemaName,
        schema?.requiredSchemaName,
        response.ok
      );

      console.log('getReplyPostData called with inputs and output:', {
        inputs: {
          isValid,
          schemaName,
          requiredSchemaName: schema?.requiredSchemaName,
          responseOk: response.ok,
        },
        castData: replyPostData,
      });

      await publishToExternalWebhook(
        channelType,
        replyPostData.text,
        replyPostData.embeds,
        postId
      );
    } catch (err) {
      console.error(err);
      return (err as Error).message;
    }
  } else {
    try {
      const replyPostData = getReplyPostData(isValid, schemaName);
      console.log('Publish reply called with inputs and output:', {
        inputs: { isValid, schemaName },
        replyPostData,
      });

      await publishToExternalWebhook(
        channelType,
        replyPostData.text,
        replyPostData.embeds,
        postId
      );
    } catch (err) {
      console.error('Error publishing reply:', err);
      return (err as Error).message;
    }
  }
}
