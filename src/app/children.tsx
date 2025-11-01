"use client";

import { BalanceRefreshContext } from "@/app/context";
import Nav from "@/components/nav";
import Top from "@/components/top";
import { queryClient, wagmiConfig } from "@/utils/wagmi";
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
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {/* <RainbowKitProvider> */}

          <Top />
          <Nav />
          <div className="w-full max-w-7xl mx-auto px-4 flex-1">{children}</div>
          <footer className="border-t py-4 text-center text-sm">
            © {new Date().getFullYear()} Your app
          </footer>

          {/* </RainbowKitProvider> */}
        </QueryClientProvider>
      </WagmiProvider>
    </BalanceRefreshContext.Provider>
  );
}
