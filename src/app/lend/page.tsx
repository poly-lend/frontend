"use client";

import ConnectWallet from "@/components/connectWallet";
import LoansTable from "@/components/loansTable";
import OffersTable from "@/components/offersTable";
import RequestsListTable from "@/components/requestsListTable";
import { Stack } from "@mui/material";
import { useAccount } from "wagmi";

export default function Lend() {
  const { address } = useAccount();
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
      <RequestsListTable />
      {address ? (
        <>
          <OffersTable address={address} />
          <LoansTable lender={address} />
        </>
      ) : (
        <>
          <div>Connect your wallet to see your offers and loans</div>
          <ConnectWallet />
        </>
      )}
    </Stack>
  );
}
