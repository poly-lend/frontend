"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmh35gipr00stl20ct0rebsu0"
      clientId="56fNVp31uXnkfHMKftibEjWzjoHJ3ka88rqBDSD75uCGoiQBLtF6iUXXkERpUiFv5uiU3bjCPiu97jp72z7tKyNi"
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
