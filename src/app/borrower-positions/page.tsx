"use client";

import BorrowerOffersTable from "@/components/borrower/borrowerOffersTable";
import WalletGuard from "@/components/web3/walletGuard";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function BorrowerPositions() {
  const [data, setData] = useState<AllLoanData | null>(null);

  const { address } = useAccount();

  useEffect(() => {
    fetchData({ borrower: address }).then(setData);
  }, [address]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-center text-4xl mb-4">
        Positions & Offers
      </h1>

      <WalletGuard isDataReady={!!data}>
        <BorrowerOffersTable data={data as AllLoanData} />
      </WalletGuard>
    </div>
  );
}
