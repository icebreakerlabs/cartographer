"use client";

import CredentialFeed from "./components/credential-feed";
import React from "react";
import sdk from "@farcaster/frame-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
      const load = async () => {
      sdk.actions.ready();
      };
      if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      }
  }, [isSDKLoaded]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <CredentialFeed />
    </div>
  );
}