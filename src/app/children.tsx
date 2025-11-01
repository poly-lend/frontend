"use client";

import { BalanceRefreshContext } from "@/app/context";
import Bottom from "@/components/bottom";
import Nav from "@/components/nav";
import Top from "@/components/top";
import { queryClient, wagmiConfig } from "@/utils/wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";

export default function Children({ children }: { children: React.ReactNode }) {
  const [balanceRefresh, setBalanceRefresh] = useState(false);

  return (
    <BalanceRefreshContext.Provider
      value={{ balanceRefresh, setBalanceRefresh }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Top />
          <Nav />
          <div className="w-full max-w-7xl mx-auto px-4 flex-1">{children}</div>
          <Bottom />
        </QueryClientProvider>
      </WagmiProvider>
    </BalanceRefreshContext.Provider>
  );
}
