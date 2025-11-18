"use client";

import BorrowerLoansTable from "@/components/borrower/borrowerLoansTable";
import BorrowerRequestsTable from "@/components/borrower/borrowerRequestsTable";
import RequestDialog from "@/components/dialogs/requestDialog";
import WalletGuard from "@/components/web3/walletGuard";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { Alert, Button, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function Borrow() {
  const [data, setData] = useState<AllLoanData | null>(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!publicClient || !walletClient) return;
    fetchData({ publicClient, borrower: address }).then(setData);
  }, [publicClient, walletClient, address]);

  const handleRequestSuccess = async (successText: string) => {
    setSuccessText(successText);
    setErrorText("");
    if (!publicClient || !walletClient) return;
    const fresh = await fetchData({ publicClient, borrower: address });
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
        Borrow
      </h1>
      <RequestDialog
        open={openRequestDialog}
        close={() => setOpenRequestDialog(false)}
        onSuccess={(successText: string) => handleRequestSuccess(successText)}
        onError={(text: string) => {
          setErrorText(text);
          setSuccessText("");
        }}
      />
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

      <WalletGuard isDataReady={!!data}>
        <>
          <div className="flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenRequestDialog(true)}
              className="shadow-lg rounded-full w-fit"
              size="large"
            >
              Request a Loan
            </Button>
          </div>
          <BorrowerRequestsTable
            address={address as `0x${string}`}
            title="Borrower Requests"
            data={data as AllLoanData}
            onActionSuccess={(text: string) => handleRequestSuccess(text)}
            onActionError={(text: string) => {
              setErrorText(text);
              setSuccessText("");
            }}
          />
          <BorrowerLoansTable
            borrower={address as `0x${string}`}
            title="Borrower Loans"
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
