"use client";

import ConnectWallet from "@/components/connectWallet";
import LoansTable from "@/components/loansTable";
import BorrowForm from "@/components/requestForm";
import RequestsTable from "@/components/requestsTable";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function Borrow() {
  const { address } = useAccount();

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [data, setData] = useState<AllLoanData | null>(null);
  useEffect(() => {
    if (!publicClient || !walletClient) return;
    fetchData({ publicClient, borrower: address }).then(setData);
  }, [publicClient, walletClient, address]);

  return (
    <Stack spacing={2}>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          paddingTop: 50,
          paddingBottom: 20,
          textAlign: "center",
        }}
      >
        Borrow
      </h1>

      {address && <BorrowForm />}
      {address && data && (
        <RequestsTable
          address={address}
          title="Borrower Requests"
          data={data}
        />
      )}
      {address && data && (
        <LoansTable borrower={address} title="Borrower Loans" data={data} />
      )}
      {!address && (
        <>
          <div>Connect your wallet to see your requests and loans data</div>
          <ConnectWallet />
        </>
      )}
    </Stack>
  );
}
