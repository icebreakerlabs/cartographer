/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { BASE_URL } from "../lib/utils";
 
const handleRequest = frames(async() => {
  return {
    image: 'https://i.imgur.com/jS6MHOW.png',
    buttons: [
      <Button action="link" target={`https://warpcast.com/~/composer-action?url=${BASE_URL}/api/composer-action`}>
        Load Mini App
      </Button>,
    ],
  };
});
 
export const GET = handleRequest;
export const POST = handleRequest;