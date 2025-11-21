import { polylendAddress, usdcAddress, usdcDecimals } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import useErc20Allowance from "@/hooks/useErc20Allowance";
import { fetchAmountOwed } from "@/utils/fetchAmountOwed";
import { useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import InfoAlert from "../widgets/infoAlert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type RepayDialogProps = {
  loanId: bigint;
  onSuccess?: (successText: string) => void;
  onError?: (errorText: string) => void;
};

export default function RepayDialog({
  loanId,
  onSuccess,
  onError,
}: RepayDialogProps) {
  const [open, setOpen] = useState(false);
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isApproving, setIsApproving] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isRepaying, setIsRepaying] = useState(false);
  const [repayTxHash, setRepayTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );

  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash,
    });
  const { isLoading: isRepayConfirming, isSuccess: isRepayConfirmed } =
    useWaitForTransactionReceipt({
      hash: repayTxHash,
    });

  const { allowance, isLoading: isAllowanceLoading } = useErc20Allowance(
    open,
    usdcAddress as `0x${string}`,
    polylendAddress as `0x${string}`,
    [isApprovalConfirmed]
  );

  const hasSufficientAllowance = allowance >= amount;
  const repayIsEnabled =
    !isAllowanceLoading && (isApprovalConfirmed || hasSufficientAllowance);

  useEffect(() => {
    const getAmountOwed = async () => {
      if (!publicClient || !open) return;
      const amount = await fetchAmountOwed({
        publicClient,
        loanId,
        timestamp,
      });
      setAmount(amount);
    };
    getAmountOwed();
  }, [open, publicClient, loanId, timestamp]);

  useEffect(() => {
    if (open) {
      setIsApproving(false);
      setApprovalTxHash(undefined);
      setIsRepaying(false);
      setRepayTxHash(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (isRepayConfirmed) {
      setOpen(false);
      onSuccess?.("Repayment submitted successfully");
    }
  }, [isRepayConfirmed, onSuccess]);

  const handleApproval = async (amount: bigint) => {
    if (!walletClient || !publicClient) return;
    try {
      setIsApproving(true);
      const hash = await walletClient.writeContract({
        address: usdcAddress as `0x${string}`,
        abi: usdcConfig.abi,
        functionName: "approve",
        args: [polylendAddress, amount],
      });
      setApprovalTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      onError?.(message);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRepay = async (loanId: bigint, timestamp: bigint) => {
    if (!walletClient || !publicClient) return;
    try {
      setIsRepaying(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "repay",
        args: [loanId, timestamp],
      });
      setRepayTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      onError?.(message);
    } finally {
      setIsRepaying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Repay</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Repay a Loan</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="amountOwed">Amount Owed</Label>
              <Input
                id="amountOwed"
                type="text"
                value={(Number(amount) / 10 ** usdcDecimals).toFixed(6)}
                disabled
              />
            </div>

            {!repayIsEnabled && amount > BigInt(0) && !isAllowanceLoading && (
              <InfoAlert text="You need to approve the contract to spend your tokens before you can repay the loan. Click 'Approve' first, then 'Repay' once the approval is confirmed." />
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <div className="flex items-center gap-2">
              {!repayIsEnabled && !isAllowanceLoading && (
                <Button
                  onClick={() => handleApproval(amount)}
                  disabled={
                    isApproving || isApprovalConfirming || amount === BigInt(0)
                  }
                >
                  {isApproving || isApprovalConfirming
                    ? "Approving..."
                    : "Approve"}
                </Button>
              )}

              <Button
                onClick={() => handleRepay(loanId, timestamp)}
                disabled={isRepaying || isRepayConfirming || !repayIsEnabled}
              >
                {isRepaying || isRepayConfirming ? "Repaying..." : "Repay"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
