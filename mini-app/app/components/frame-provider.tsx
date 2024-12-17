'use client'

import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";

export default function FrameProvider({ children }: { children: React.ReactNode }){
    
    useEffect(() => {
        const init = async () => {
          const context = await sdk.context;
          if (context?.client.clientFid) {
            sdk.actions.ready();
          }
        }
        init()
      }, [])

    return(
        <>
         {children}
        </>
    )
}