"use client";

import BorrowerLoansTable from "@/components/borrower/borrowerLoansTable";
import BorrowerRequestsTable from "@/components/borrower/borrowerRequestsTable";
import RequestDialog from "@/components/dialogs/requestDialog";
import ConnectWidget from "@/components/web3/connectWidget";
import { AllLoanData } from "@/types/polyLend";
import ClientOnly from "@/utils/clientOnly";
import { fetchData } from "@/utils/fetchData";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function Borrow() {
  const [data, setData] = useState<AllLoanData | null>(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!publicClient || !walletClient) return;
    fetchData({ publicClient, borrower: address }).then(setData);
  }, [publicClient, walletClient, address]);

  return (
    <div className="relative min-h-[calc(100vh-150px)]">
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
        <RequestDialog
          open={openRequestDialog}
          close={() => setOpenRequestDialog(false)}
        />
        <ClientOnly>
          {address ? (
            <>
              {data && (
                <>
                  <BorrowerRequestsTable
                    address={address}
                    title="Borrower Requests"
                    data={data}
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

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenRequestDialog(true)}
        className="shadow-lg rounded-full"
        sx={{
          position: "absolute",
          bottom: 32,
          right: 8,
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        size="large"
      >
        Request a loan
      </Button>
    </div>
  );
}
