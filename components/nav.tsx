"use client";

import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { WagmiProvider } from "wagmi";
import { config, queryClient } from "./wagmi";

export default function Nav() {
  const link = { marginRight: 12 };
  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        <div>
          <Link href="/" style={link}>
            Home
          </Link>
          <Link href="/lend" style={link}>
            Lend
          </Link>
          <Link href="/borrow" style={link}>
            Borrow
          </Link>
          <Link href="/points" style={link}>
            Points
          </Link>
        </div>
        <div>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                <ConnectButton />
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </div>
      </nav>
    </>
  );
}
