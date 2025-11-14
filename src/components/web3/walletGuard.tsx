"use client";

import ClientOnly from "@/utils/clientOnly";
import { CircularProgress } from "@mui/material";
import { ReactNode } from "react";
import { useAccount } from "wagmi";
import ConnectWidget from "./connectWidget";

type WalletGuardProps = {
  children: ReactNode;
  isDataReady?: boolean;
  loadingFallback?: ReactNode;
  disconnectedFallback?: ReactNode;
};

export default function WalletGuard({
  children,
  isDataReady = true,
  loadingFallback,
  disconnectedFallback,
}: WalletGuardProps) {
  const { status } = useAccount();

  const isWalletLoading = status === "connecting" || status === "reconnecting";
  const showSpinner =
    isWalletLoading || (status === "connected" && !isDataReady);
  const showConnect = status === "disconnected";

  return (
    <ClientOnly>
      {showSpinner ? (
        loadingFallback ?? (
          <div className="flex justify-center py-6">
            <CircularProgress />
          </div>
        )
      ) : showConnect ? (
        disconnectedFallback ?? <ConnectWidget />
      ) : (
        <>{children}</>
      )}
    </ClientOnly>
  );
}
