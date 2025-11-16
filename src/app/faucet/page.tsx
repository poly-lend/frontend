"use client";

import { BalanceRefreshContext } from "@/app/context";
import WalletGuard from "@/components/web3/walletGuard";
import LoadingActionButton from "@/components/widgets/loadingActionButton";
import { usdcDecimals } from "@/configs";
import { usdcConfig } from "@/contracts/usdc";
import { Alert, Input, Snackbar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Faucet() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(1000);
  const { setBalanceRefresh } = useContext(BalanceRefreshContext);
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);
  const [lastNotifiedHash, setLastNotifiedHash] = useState<
    `0x${string}` | undefined
  >(undefined);

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const mintUSDC = async () => {
    setSubmittedAmount(amount);
    writeContract({
      address: usdcConfig.address,
      abi: usdcConfig.abi,
      functionName: "mint",
      args: [address as `0x${string}`, BigInt(amount * 10 ** usdcDecimals)],
    });
  };

  useEffect(() => {
    if (isConfirmed && hash && hash !== lastNotifiedHash) {
      setBalanceRefresh(true);
      const minted = (submittedAmount ?? amount).toLocaleString();
      setSuccessText(`Minted ${minted} pfUSDC`);
      setErrorText("");
      setLastNotifiedHash(hash);
    }
  }, [isConfirmed, hash, lastNotifiedHash, setBalanceRefresh, submittedAmount]);

  useEffect(() => {
    if (error) {
      const message =
        (error as BaseError)?.shortMessage ||
        (error as Error)?.message ||
        "Transaction failed";
      setErrorText(message);
      setSuccessText("");
    }
  }, [error]);

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
        Faucet
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

      <WalletGuard>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-4">
            <Input
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={() => mintUSDC()}
              loading={isPending || isConfirming}
              disabled={isPending || isConfirming}
            >
              Mint pfUSDC
            </LoadingActionButton>
          </div>
        </div>
      </WalletGuard>
    </div>
  );
}
