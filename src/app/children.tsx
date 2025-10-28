"use client";

import { BalanceRefreshContext } from "@/app/context";
import Nav from "@/components/nav";
import Top from "@/components/top";
import { config, queryClient } from "@/utils/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";

export default function Children({ children }: { children: React.ReactNode }) {
  const [balanceRefresh, setBalanceRefresh] = useState(false);

  return (
    <BalanceRefreshContext.Provider
      value={{ balanceRefresh, setBalanceRefresh }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Top />
            <Nav />
            <div className="w-full max-w-7xl mx-auto px-4">{children}</div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BalanceRefreshContext.Provider>
  );
}
