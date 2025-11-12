"use client";

import LenderLoansTable from "@/components/lender/lenderLoansTable";
import LenderOffersTable from "@/components/lender/lenderOffersTable";
import LenderRequestsTable from "@/components/lender/lenderRequestsTable";
import ConnectWidget from "@/components/web3/connectWidget";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { Alert, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

export default function Lend() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [data, setData] = useState<AllLoanData | null>(null);
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    if (!publicClient) return;
    fetchData({ publicClient }).then(setData);
  }, [publicClient, address]);

  const handleRequestSuccess = async (successText: string) => {
    setSuccessText(successText);
    if (!publicClient) return;
    const fresh = await fetchData({ publicClient });
    setData(fresh);
  };

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
      {data && (
        <LenderRequestsTable
          title="All Requests"
          data={data}
          userAddress={address as `0x${string}`}
          onRequestSuccess={(successText: string) =>
            handleRequestSuccess(successText)
          }
        />
      )}
      <Snackbar
        open={!!successText}
        autoHideDuration={4000}
        onClose={() => setSuccessText("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessText("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successText || "Action completed successfully"}
        </Alert>
      </Snackbar>
      {address && data ? (
        <>
          <LenderOffersTable
            title="Lender Offers"
            data={data}
            userAddress={address as `0x${string}`}
            onCancelOfferSuccess={(successText: string) =>
              handleRequestSuccess(successText)
            }
          />
          <LenderLoansTable lender={address} title="Lender Loans" data={data} />
        </>
      ) : (
        <ConnectWidget />
      )}
    </Stack>
  );
}
