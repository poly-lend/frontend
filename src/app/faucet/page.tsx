"use client";

import { BalanceRefreshContext } from "@/app/context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WalletGuard from "@/components/web3/walletGuard";
import LoadingActionButton from "@/components/widgets/loadingActionButton";
import { usdcDecimals } from "@/config";
import { usdcConfig } from "@/contracts/usdc";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
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
  const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);

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
    if (isConfirmed && hash) {
      setBalanceRefresh(true);
      const minted = (submittedAmount ?? amount).toLocaleString();
      toast.success(`Minted ${minted} pfUSDC`);
    }
  }, [isConfirmed, hash, setBalanceRefresh, submittedAmount]);

  useEffect(() => {
    if (error) {
      const message =
        (error as BaseError)?.shortMessage ||
        (error as Error)?.message ||
        "Transaction failed";
      toast.error(message);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-center text-4xl mb-4">Faucet</h1>

      <WalletGuard>
        <div className="mt-6 w-full max-w-md mx-auto rounded-xl border border-slate-900 bg-slate-950/80 p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-50">
              Mint test pfUSDC
            </h2>
            <p className="text-xs text-slate-300">
              Request test pfUSDC for experimenting with PolyLend. Funds are for
              testing only and have no real-world value.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="faucet-amount"
                className="text-xs font-medium text-slate-200"
              >
                Amount to mint
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="faucet-amount"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1"
                />
                <LoadingActionButton
                  onClick={() => mintUSDC()}
                  loading={isPending || isConfirming}
                  disabled={isPending || isConfirming}
                  className="min-w-30"
                >
                  {isPending || isConfirming ? "Minting..." : "Mint pfUSDC"}
                </LoadingActionButton>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Transaction may take a few moments to confirm on-chain.
            </p>
          </div>
        </div>
      </WalletGuard>
    </div>
  );
}
