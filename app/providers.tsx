"use client";
import { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { CHAIN } from "@/lib/contract";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={CHAIN}
      config={{
        appearance: {
          mode: "auto",
          theme: "snake",
          name: "GOLAZO",
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
      miniKit={{ enabled: true }}
    >
      {children}
    </OnchainKitProvider>
  );
}
