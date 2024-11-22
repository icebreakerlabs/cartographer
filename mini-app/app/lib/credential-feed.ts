import { FeedResponse } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { IcebreakerProfile } from "./types";
import { BASE_URL, getIcebreakerProfileFromEthAddress, getIcebreakerProfileFromFname } from "./utils";

type ProfileResponse = {
    profiles: IcebreakerProfile[];
};

export const getHydratedProfileFromEthAddress = async(address: string) => {
    if(!address){
        return;
    }
    const ethAddressUser = await getIcebreakerProfileFromEthAddress(address);
    const fcCredential = ethAddressUser?.channels?.find((channel) => channel.type === 'farcaster');
    const fname = fcCredential?.value
    // note: we need to make this second reqeust to get the Icebreaker user by their fname because
    // requesting *just* the user by their ETH address doesn't give us their fid in the return object
    const fnameUser = await getIcebreakerProfileFromFname(fname);
    return fnameUser
}

export const getProfilesHoldingCredential = async (name: string): Promise<IcebreakerProfile[] | undefined> => {
    if (!name) {
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/credentials?name=${name}`);
      if (!response.ok) {
        throw new Error('Error fetching data for fname');
      }
      const json: ProfileResponse = await response.json();
      return json.profiles;
    } catch (err) {
      console.error(err);
      return;
    }
};

export const getFeedFromFids = async (fids: number[]): Promise<FeedResponse> => {
  const queryParams = new URLSearchParams({ fids: fids.join(',') });

  const response = await fetch(`/api/feed?${queryParams.toString()}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch feed');
  }

  return response.json();
};

export const getCredentialFeed = async(credentialName: string) => {
    if (!credentialName) {
      return;
    }
    try {
      const fids = await getFidsFromCredentialName(credentialName);
      if (!fids || fids.length === 0) {
        throw new Error('No fids found');
      }
      const fidsFeed = await getFeedFromFids(fids);
      return fidsFeed;
    } catch (err) {
      console.error(err);
      return;
    }
}

export const getFidsFromCredentialName = async(name: string): Promise<number[] | undefined> => {
    if (!name) {
        return;
      }
      try {
       const profiles = await getProfilesHoldingCredential(name);
        if (!profiles || profiles.length === 0) {
          throw new Error('No profiles or credentials found');
        }
        const hydratedProfiles = await Promise.all(profiles.map(async(profile) => {
            const finalProfile = await getHydratedProfileFromEthAddress(profile.walletAddress);
            return finalProfile;
        }));
        return hydratedProfiles.map((profile) => {
          const fcChannel = profile?.channels?.find((channel) => channel.type === 'farcaster');
          if(fcChannel && fcChannel.metadata){
            return parseInt(fcChannel.metadata[0].value);
          }
        }).filter((fid): fid is number => fid !== undefined);
      } catch (err) {
        console.error(err);
        return;
      }
}