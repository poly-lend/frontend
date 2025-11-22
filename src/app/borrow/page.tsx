"use client";

import BorrowerLoansTable from "@/components/borrower/borrowerLoansTable";
import BorrowerRequestsTable from "@/components/borrower/borrowerRequestsTable";
import RequestDialog from "@/components/dialogs/requestDialog";
import WalletGuard from "@/components/web3/walletGuard";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function Borrow() {
  const [data, setData] = useState<AllLoanData | null>(null);
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

  useEffect(() => {
    if (!!successText) {
      toast.success(successText);
    } else if (!!errorText) {
      toast.error(errorText);
    }
  }, [successText, errorText]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-center text-4xl mb-4">Borrow</h1>

      <WalletGuard isDataReady={!!data}>
        <>
          <div className="flex justify-center">
            <RequestDialog
              onSuccess={(successText: string) =>
                handleRequestSuccess(successText)
              }
              onError={(text: string) => {
                setErrorText(text);
                setSuccessText("");
              }}
            />
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
