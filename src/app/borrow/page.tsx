"use client";

import ConnectWallet from "@/components/connectWallet";
import LoansTable from "@/components/loansTable";
import BorrowForm from "@/components/requestForm";
import RequestsTable from "@/components/requestsTable";
import { Stack } from "@mui/material";
import { useAccount } from "wagmi";

export default function Borrow() {
  const { address } = useAccount();

  return (
    <>
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

        <BorrowForm />
      </Stack>
      {address ? (
        <>
          <RequestsTable address={address} />
          <LoansTable address={address} />
        </>
      ) : (
        <>
          <div>Connect your wallet to see your loans and requests</div>
          <ConnectWallet />
        </>
      )}
    </>
  );
}
