"use client";

import LenderLoansTable from "@/components/lender/lenderLoansTable";
import LenderOffersTable from "@/components/lender/lenderOffersTable";
import LenderRequestsTable from "@/components/lender/lenderRequestsTable";
import ConnectWidget from "@/components/web3/connectWidget";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { Stack } from "@mui/material";
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
        Lend
      </h1>
      {data && <LenderRequestsTable title="All Requests" data={data} />}
      {address && data ? (
        <>
          <LenderLoansTable lender={address} title="Lender Loans" data={data} />
          <LenderOffersTable title="Lender Offers" data={data} />
        </>
      ) : (
        <ConnectWidget />
      )}
    </Stack>
  );
}
