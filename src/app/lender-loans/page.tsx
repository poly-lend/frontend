"use client";

import LenderLoansTable from "@/components/lender/lenderLoansTable";
import { Spinner } from "@/components/ui/spinner";
import WalletGuard from "@/components/web3/walletGuard";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

export default function Lend() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [data, setData] = useState<AllLoanData | null>(null);

  useEffect(() => {
    if (!publicClient) return;
    fetchData({ publicClient }).then(setData);
  }, [publicClient, address]);

  const handleRefreshData = () => {
    if (!publicClient) return;
    fetchData({ publicClient }).then(setData);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-center text-4xl mb-4">Lend</h1>

      <WalletGuard
        isDataReady={!!data}
        disconnectedChildren={
          !!data ? (
            "?"
          ) : (
            <div className="flex justify-center py-6">
              <Spinner className="size-12 text-primary" />
            </div>
          )
        }
      >
        <>
          <LenderLoansTable
            lender={address as `0x${string}`}
            data={data as AllLoanData}
            onDataRefresh={handleRefreshData}
          />
        </>
      </WalletGuard>
    </div>
  );
}
