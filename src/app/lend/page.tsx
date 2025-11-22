"use client";

import LenderLoansTable from "@/components/lender/lenderLoansTable";
import LenderOffersTable from "@/components/lender/lenderOffersTable";
import LenderRequestsTable from "@/components/lender/lenderRequestsTable";
import WalletGuard from "@/components/web3/walletGuard";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { Alert, Snackbar } from "@mui/material";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

export default function Lend() {
  const { address, status } = useAccount();
  const publicClient = usePublicClient();
  const [data, setData] = useState<AllLoanData | null>(null);
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!publicClient) return;
    fetchData({ publicClient }).then(setData);
  }, [publicClient, address]);

  const handleRequestSuccess = async (successText: string) => {
    setSuccessText(successText);
    setErrorText("");
    if (!publicClient) return;
    const fresh = await fetchData({ publicClient });
    setData(fresh);
  };

  return (
    <div className="flex flex-col gap-2">
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
      {(errorText || successText) && (
        <Snackbar
          open={!!successText || !!errorText}
          autoHideDuration={4000}
          onClose={() => {
            setSuccessText("");
            setErrorText("");
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setSuccessText("");
              setErrorText("");
            }}
            severity={errorText ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {errorText || successText}
          </Alert>
        </Snackbar>
      )}

      <WalletGuard
        isDataReady={!!data}
        disconnectedChildren={
          !!data ? (
            <>
              <LenderRequestsTable
                title="All Requests"
                data={data as AllLoanData}
                userAddress={undefined}
                onRequestSuccess={(successText: string) =>
                  handleRequestSuccess(successText)
                }
                onRequestError={(text: string) => {
                  setErrorText(text);
                  setSuccessText("");
                }}
              />
            </>
          ) : (
            <div className="flex justify-center py-6">
              <Spinner className="size-12 text-primary" />
            </div>
          )
        }
      >
        <>
          <LenderRequestsTable
            title="All Requests"
            data={data as AllLoanData}
            userAddress={address as `0x${string}`}
            onRequestSuccess={(successText: string) =>
              handleRequestSuccess(successText)
            }
            onRequestError={(text: string) => {
              setErrorText(text);
              setSuccessText("");
            }}
          />
          <LenderOffersTable
            title="Lender Offers"
            data={data as AllLoanData}
            userAddress={address as `0x${string}`}
            onCancelOfferSuccess={(successText: string) =>
              handleRequestSuccess(successText)
            }
            onCancelOfferError={(text: string) => {
              setErrorText(text);
              setSuccessText("");
            }}
          />
          <LenderLoansTable
            lender={address as `0x${string}`}
            title="Lender Loans"
            data={data as AllLoanData}
            onActionSuccess={(text: string) => handleRequestSuccess(text)}
            onActionError={(text: string) => {
              setErrorText(text);
              setSuccessText("");
            }}
          />
        </>
      </WalletGuard>
    </div>
  );
}
