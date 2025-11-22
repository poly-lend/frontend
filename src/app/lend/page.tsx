"use client";

import LenderLoansTable from "@/components/lender/lenderLoansTable";
import LenderOffersTable from "@/components/lender/lenderOffersTable";
import LenderRequestsTable from "@/components/lender/lenderRequestsTable";
import WalletGuard from "@/components/web3/walletGuard";
import { AllLoanData } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { toast } from "sonner";

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

  useEffect(() => {
    if (!!successText) {
      toast.success(successText);
    } else if (!!errorText) {
      toast.error(errorText);
    }
  }, [successText, errorText]);

  const handleRequestSuccess = async (successText: string) => {
    setSuccessText(successText);
    setErrorText("");
    if (!publicClient) return;
    const fresh = await fetchData({ publicClient });
    setData(fresh);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-center text-4xl mb-4">Lend</h1>

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
