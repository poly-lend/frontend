"use client";

import BorrowerLoansTable from "@/components/borrower/borrowerLoansTable";
import BorrowerRequestsTable from "@/components/borrower/borrowerRequestsTable";
import RequestDialog from "@/components/dialogs/requestDialog";
import ConnectWidget from "@/components/web3/connectWidget";
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

      {address && <RequestDialog />}
      {address && data && (
        <BorrowerRequestsTable
          address={address}
          title="Borrower Requests"
          data={data}
        />
      )}
      {address && data && (
        <BorrowerLoansTable
          borrower={address}
          title="Borrower Loans"
          data={data}
        />
      )}
      {!address && <ConnectWidget />}
    </Stack>
  );
}
