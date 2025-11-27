import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { polylendAddress, usdcAddress, usdcDecimals } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import useErc20Allowance from "@/hooks/useErc20Allowance";
import { toDuration, toSPYWAI } from "@/utils/convertors";
import { HandCoinsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseError } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import InfoAlert from "../widgets/infoAlert";
import LoadingActionButton from "../widgets/loadingActionButton";

export default function OfferDialog({
  marketIds,
  loanDuration,
  onDataRefresh,
}: {
  marketIds: string[];
  loanDuration: number;
  onDataRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(1);
  const [rate, setRate] = useState(20);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isOffering, setIsOffering] = useState(false);
  const [offerTxHash, setOfferTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash,
    });

  const { isLoading: isOfferConfirming, isSuccess: isOfferConfirmed } =
    useWaitForTransactionReceipt({
      hash: offerTxHash,
    });

  useEffect(() => {
    if (open) {
      setIsApproving(false);
      setApprovalTxHash(undefined);
      setIsOffering(false);
      setOfferTxHash(undefined);
      setLoanAmount(1);
      setRate(20);
    }
  }, [open]);

  useEffect(() => {
    if (isOfferConfirmed && offerTxHash) {
      setOpen(false);
      toast.success("Offer submitted successfully");
      onDataRefresh();
    }
  }, [isOfferConfirmed, offerTxHash]);

  const handleApproval = async () => {
    if (!publicClient || !walletClient) return;
    try {
      setIsApproving(true);
      const hash = await walletClient.writeContract({
        address: usdcAddress as `0x${string}`,
        abi: usdcConfig.abi,
        functionName: "approve",
        args: [polylendAddress, BigInt(loanAmount * 10 ** usdcDecimals)],
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

  const handleOffer = async () => {
    if (!publicClient || !walletClient) return;
    const rateInSPY = toSPYWAI(rate / 100);
    const loanAmountInUSDC = loanAmount * 10 ** usdcDecimals;
    try {
      const markets = marketIds.reduce((acc: any, market: string) => {
        acc.push(...JSON.parse(market));
        return acc;
      }, []);

      setIsOffering(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "offer",
        args: [
          BigInt(loanAmountInUSDC),
          rateInSPY,
          markets,
          BigInt(1),
          BigInt(1),
          BigInt(1 * 60 * 60 * 24),
          false,
        ],
      });
      setOfferTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      toast.error(message);
    } finally {
      setIsOffering(false);
    }
  };

  const { allowance, isLoading: isAllowanceLoading } = useErc20Allowance(
    open,
    usdcAddress as `0x${string}`,
    polylendAddress as `0x${string}`,
    [isApprovalConfirmed]
  );

  const requiredAllowance = BigInt(loanAmount * 10 ** usdcDecimals);
  const hasSufficientAllowance = allowance >= requiredAllowance;
  const offerIsEnabled =
    !isAllowanceLoading && (isApprovalConfirmed || hasSufficientAllowance);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button disabled={marketIds.length === 0}>Offer</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
          </DialogHeader>

          {/* Inputs for loan amount and rate */}
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="amount">Loan Amount (pfUSDC)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={loanAmount.toString()}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Selected Markets</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                disabled
                value={marketIds.length.toString()}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="rate">Rate (APY)</Label>
              <Input
                id="rate"
                name="rate"
                type="number"
                value={rate.toString()}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Info boxes */}
          <div className="flex flex-col gap-2">
            {loanAmount > 0 && rate > 0 && (
              <Alert>
                <HandCoinsIcon />
                <AlertDescription className="flex text-gray-300">
                  <p>
                    You will receive{" "}
                    <span className="text-primary">
                      {(
                        loanAmount +
                        (loanAmount * rate * loanDuration) / (100 * 31536000)
                      ).toFixed(2)}{" "}
                      pfUSDC
                    </span>{" "}
                    after the {toDuration(loanDuration)} loan duration
                    (principal + interest).
                  </p>
                </AlertDescription>
              </Alert>
            )}
            {!offerIsEnabled && loanAmount > 0 && !isAllowanceLoading && (
              <InfoAlert text="You need to approve the contract to spend your tokens before you can make an offer. Click 'Approve' first, then 'Offer' once the approval is confirmed." />
            )}
          </div>

          {/* Buttons */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline-destructive">Cancel</Button>
            </DialogClose>
            <div className="flex items-center gap-2">
              {!offerIsEnabled && !isAllowanceLoading && (
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
                onClick={handleOffer}
                disabled={
                  loanAmount <= 0 || rate <= 0 || isOffering || !offerIsEnabled
                }
                loading={isOffering || isOfferConfirming}
              >
                Offer
              </LoadingActionButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
