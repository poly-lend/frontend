"use client";

import ConnectWidget from "@/components/connectWidget";
import LenderLoansTable from "@/components/lenderLoansTable";
import BorrowerOffersTable from "@/components/lenderOffersTable";
import LenderRequestsTable from "@/components/lenderRequestsTable";
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
    fetchData({ publicClient, lender: address }).then(setData);
    console.log(data);
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
          <BorrowerOffersTable title="Lender Offers" data={data} />
          <LenderLoansTable title="Lender Loans" data={data} />
        </>
      ) : (
        <ConnectWidget />
      )}
    </Stack>
  );
}
