"use client";

import BorrowerLoansTable from "@/components/borrower/borrowerLoansTable";
import BorrowerRequestsTable from "@/components/borrower/borrowerRequestsTable";
import RequestDialog from "@/components/dialogs/requestDialog";
import ConnectWidget from "@/components/web3/connectWidget";
import { AllLoanData } from "@/types/polyLend";
import ClientOnly from "@/utils/clientOnly";
import { fetchData } from "@/utils/fetchData";
import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function Borrow() {
  const [data, setData] = useState<AllLoanData | null>(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [successText, setSuccessText] = useState("");

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!publicClient || !walletClient) return;
    fetchData({ publicClient, borrower: address }).then(setData);
  }, [publicClient, walletClient, address]);

  const handleRequestSuccess = async (successText: string) => {
    setSuccessText(successText);
    if (!publicClient || !walletClient) return;
    const fresh = await fetchData({ publicClient, borrower: address });
    setData(fresh);
  };

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
        <div className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenRequestDialog(true)}
            className="shadow-lg rounded-full w-fit"
            size="large"
          >
            Request a loan
          </Button>
        </div>
        <RequestDialog
          open={openRequestDialog}
          close={() => setOpenRequestDialog(false)}
          onSuccess={(successText: string) => handleRequestSuccess(successText)}
        />
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
        <ClientOnly>
          {address ? (
            <>
              {data && (
                <>
                  <BorrowerRequestsTable
                    address={address}
                    title="Borrower Requests"
                    data={data}
                    onActionSuccess={(text: string) =>
                      handleRequestSuccess(text)
                    }
                  />
                  <BorrowerLoansTable
                    borrower={address}
                    title="Borrower Loans"
                    data={data}
                  />
                </>
              )}
            </>
          ) : (
            <ConnectWidget />
          )}
        </ClientOnly>
      </Stack>
    </>
  );
}
