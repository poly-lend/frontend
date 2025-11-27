"use client";

import BorrowerLoansTable from "@/components/borrower/borrowerLoansTable";
import WalletGuard from "@/components/web3/walletGuard";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function BorrowerLoans() {
  const [data, setData] = useState<AllLoanData | null>(null);

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!publicClient || !walletClient) return;
    fetchData({ publicClient, borrower: address }).then(setData);
  }, [publicClient, walletClient, address]);

  const handleRefreshData = () => {
    if (!publicClient) return;
    fetchData({ publicClient, borrower: address }).then(setData);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-center text-4xl mb-4">Borrow</h1>

      <WalletGuard isDataReady={!!data}>
        <BorrowerLoansTable
          borrower={address as `0x${string}`}
          data={data as AllLoanData}
          onDataRefresh={handleRefreshData}
        />
      </WalletGuard>
    </div>
  );
}
