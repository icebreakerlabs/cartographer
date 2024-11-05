import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export const ICEBREAKER_API_URL = "https://app.icebreaker.xyz/api";
export const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY ?? "");