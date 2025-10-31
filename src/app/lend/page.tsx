"use client";

import LoansTable from "@/components/loansTable";
import OffersTable from "@/components/offersTable";
import RequestsTable from "@/components/requestsTable";
import { Stack } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Lend() {
  const { address } = useAccount();
  return (
    <Stack spacing={2}>
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          paddingTop: 50,
          paddingBottom: 50,
        }}
      >
        Lend
      </h1>
      <RequestsTable />
      {address ? (
        <>
          <OffersTable address={address} />
          <LoansTable address={address} />
        </>
      ) : (
        <>
          <div>Connect your wallet to see your offers and loans</div>
          <ConnectButton showBalance={false} />
        </>
      )}
    </Stack>
  );
}
