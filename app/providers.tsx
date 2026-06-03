"use client";
import { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { CHAIN } from "@/lib/contract";
import { base, baseSepolia } from "viem/chains";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { coinbaseWallet, injected } from "wagmi/connectors";
import farcasterFrame from "@farcaster/frame-wagmi-connector";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    farcasterFrame(),
    coinbaseWallet({ appName: "Worldcup Cards" }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={CHAIN}
          config={{
            appearance: {
              mode: "auto",
              theme: "snake",
              name: "Worldcup Cards",
              logo: process.env.NEXT_PUBLIC_ICON_URL,
            },
          }}
          miniKit={{ enabled: true }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
