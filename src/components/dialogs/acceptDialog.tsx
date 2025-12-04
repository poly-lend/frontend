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
import {
  polylendAddress,
  polymarketSharesDecimals,
  polymarketTokensAddress,
} from "@/config";
import { polylendConfig } from "@/contracts/polylend";

import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import useIsApprovedForAll from "@/hooks/useIsApprovedForAll";
import useProxyAddress from "@/hooks/useProxyAddress";
import { LoanOffer } from "@/types/polyLend";
import { execSafeTransaction } from "@/utils/proxy";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseError, encodeFunctionData } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import InfoAlert from "../widgets/infoAlert";
import LoadingActionButton from "../widgets/loadingActionButton";

export default function AcceptDialog({
  offer,
  positionId,
  onDataRefresh,
}: {
  offer: LoanOffer;
  positionId: string;
  collateralAmountOwned: number;
  onDataRefresh: () => void;
  onSuccess?: (successText: string) => void;
  onError?: (errorText: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(1000);
  const [collateralAmount, setCollateralAmount] = useState(2000);
  const [minimumDuration, setMinimumDuration] = useState(30);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptTxHash, setAcceptTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );

  const { data: proxyAddress } = useProxyAddress();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash,
    });

  const { isLoading: isAcceptConfirming, isSuccess: isAcceptConfirmed } =
    useWaitForTransactionReceipt({
      hash: acceptTxHash,
    });

  useEffect(() => {
    if (open) {
      setIsApproving(false);
      setApprovalTxHash(undefined);
      setIsAccepting(false);
      setAcceptTxHash(undefined);
      setLoanAmount(1000);
      setCollateralAmount(2000);
      setMinimumDuration(1000);
    }
  }, [open]);

  useEffect(() => {
    if (isAcceptConfirmed && acceptTxHash) {
      setOpen(false);
      toast.success("Offer accepted successfully");
      onDataRefresh();
    }
  }, [isAcceptConfirmed, acceptTxHash]);

  const handleApproval = async () => {
    if (!walletClient || !publicClient || !proxyAddress) return;
    try {
      setIsApproving(true);
      const { hash } = await execSafeTransaction({
        safe: proxyAddress as `0x${string}`,
        tx: {
          to: polymarketTokensAddress as `0x${string}`,
          data: encodeFunctionData({
            abi: polymarketTokensConfig.abi,
            functionName: "setApprovalForAll",
            args: [polylendAddress as `0x${string}`, true],
          }),
        },
        walletClient,
        publicClient,
      });
      setApprovalTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      toast.error(message);
    } finally {
      setIsApproving(false);
    }
  };

  const handleAccept = async () => {
    if (!publicClient || !walletClient) return;
    try {
      setIsAccepting(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "accept",
        args: [
          BigInt(offer.offerId),
          BigInt(collateralAmount * 10 ** polymarketSharesDecimals),
          BigInt(minimumDuration * 60 * 60 * 24),
          BigInt(positionId),
          true,
        ],
      });
      setAcceptTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      toast.error(message);
    } finally {
      setIsAccepting(false);
    }
  };

  const { isApproved, isLoading: isAllowanceLoading } = useIsApprovedForAll(
    open,
    polymarketTokensAddress as `0x${string}`,
    proxyAddress as `0x${string}` | undefined,
    polylendAddress as `0x${string}`
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form className="flex">
        <DialogTrigger asChild>
          <Button>Accept</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accept an Offer</DialogTitle>
          </DialogHeader>

          {/* Inputs for loan amount and rate */}
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="amount">Loan Amount (pfUSDC)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                disabled
                value={loanAmount.toString()}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="collateralAmount">
                Collateral Amount (Shares)
              </Label>
              <Input
                id="collateralAmount"
                name="collateralAmount"
                type="number"
                value={collateralAmount.toString()}
                onChange={(e) => setCollateralAmount(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="minimumDuration">Minimum Duration (days)</Label>
              <Input
                id="minimumDuration"
                name="minimumDuration"
                type="number"
                value={minimumDuration.toString()}
                onChange={(e) => setMinimumDuration(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Info boxes */}
          <div className="flex flex-col gap-2">
            {!isApproved && loanAmount > 0 && !isAllowanceLoading && (
              <InfoAlert text="You need to approve the contract to spend your tokens before you can make an offer. Click 'Approve' first, then 'Offer' once the approval is confirmed." />
            )}
          </div>

          {/* Buttons */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline-destructive">Cancel</Button>
            </DialogClose>
            <div className="flex items-center gap-2">
              {!isApproved && !isAllowanceLoading && (
                <LoadingActionButton
                  onClick={handleApproval}
                  disabled={
                    loanAmount <= 0 || isApproving || isApprovalConfirming
                  }
                  loading={isApproving || isApprovalConfirming}
                >
                  Approve
                </LoadingActionButton>
              )}
              <LoadingActionButton
                onClick={handleAccept}
                disabled={
                  loanAmount <= 0 ||
                  minimumDuration <= 0 ||
                  collateralAmount <= 0 ||
                  isAccepting ||
                  !isApproved
                }
                loading={isAccepting || isAcceptConfirming}
              >
                Accept Offer
              </LoadingActionButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
