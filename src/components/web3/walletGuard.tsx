"use client";

import ClientOnly from "@/utils/clientOnly";
import { chain } from "@/utils/wagmi";
import { CircularProgress } from "@mui/material";
import { ReactNode } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import ConnectWidget from "./connectWidget";
import SwitchWidget from "./switchWidget";

type WalletGuardProps = {
  children: ReactNode;
  isDataReady?: boolean;
  disconnectedChildren?: ReactNode;
};

export default function WalletGuard({
  children,
  isDataReady = true,
  disconnectedChildren,
}: WalletGuardProps) {
  const { status, address, chain: currentChain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isPolygon = currentChain?.id === chain.id;
  const isWalletLoading = status === "connecting" || status === "reconnecting";

  const showConnect = status === "disconnected";
  const showSwitch = status === "connected" && !isPolygon && address;
  const showSpinner =
    isWalletLoading || (!isDataReady && !showConnect && !showSwitch);
  const showChildren =
    isDataReady && !showConnect && !showSwitch && !showSpinner;

  return (
    <ClientOnly>
      <div
        className={`h-40 flex justify-center ${
          showChildren ? "hidden" : "block"
        }`}
      >
        {showConnect && <ConnectWidget />}
        {showSwitch && <SwitchWidget />}
        {showSpinner && (
          <div className="flex justify-center py-6">
            <CircularProgress />
          </div>
        )}
      </div>
      {showChildren && <>{children}</>}
      {!showChildren && disconnectedChildren && !showSpinner && (
        <>{disconnectedChildren}</>
      )}
    </ClientOnly>
  );
}
