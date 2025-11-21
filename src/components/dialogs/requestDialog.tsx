import { polylendAddress, polymarketTokensAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import useIsApprovedForAll from "@/hooks/useIsApprovedForAll";
import useProxyAddress from "@/hooks/useProxyAddress";
import { Position } from "@/types/polymarketPosition";
import { execSafeTransaction } from "@/utils/proxy";

import { useEffect, useState } from "react";
import { BaseError, encodeFunctionData } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import InfoAlert from "../widgets/infoAlert";
import PositionSelect from "../widgets/positionSelect";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RequestDialog({
  open,
  close,
  onSuccess,
  onError,
}: {
  open: boolean;
  close: () => void;
  onSuccess?: (successText: string) => void;
  onError?: (errorText: string) => void;
}) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [shares, setShares] = useState(0);
  const [minimumDuration, setMinimumDuration] = useState(10);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);

  const { data: proxyAddress } = useProxyAddress();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [isRequesting, setIsRequesting] = useState(false);
  const [requestTxHash, setRequestTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const { isLoading: isRequestConfirming, isSuccess: isRequestConfirmed } =
    useWaitForTransactionReceipt({
      hash: requestTxHash,
    });
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash,
    });

  const {
    isApproved: isOperatorApproved,
    isLoading: isOperatorApprovalLoading,
  } = useIsApprovedForAll(
    open,
    {
      tokenAddress: polymarketTokensAddress as `0x${string}`,
      owner: proxyAddress as `0x${string}` | undefined,
      operator: polylendAddress as `0x${string}`,
      abi: polymarketTokensConfig.abi,
    },
    [isApprovalConfirmed]
  );

  const value = selectedPosition ? shares * selectedPosition.curPrice : 0;

  useEffect(() => {
    if (selectedPosition) {
      setShares(selectedPosition.size);
    }
  }, [selectedPosition]);

  // Reset UI state whenever dialog opens
  useEffect(() => {
    if (open) {
      setIsApproving(false);
      setApprovalTxHash(undefined);
      setIsRequesting(false);
      setRequestTxHash(undefined);
    }
  }, [open]);

  // When loan request confirms: close dialog and notify parent
  useEffect(() => {
    if (isRequestConfirmed) {
      close();
      onSuccess?.("Loan request submitted successfully");
    }
  }, [isRequestConfirmed]);

  const requestIsEnabled =
    !isOperatorApprovalLoading && (isApprovalConfirmed || isOperatorApproved);

  const requestLoan = async () => {
    if (!walletClient || !publicClient || !selectedPosition) return;
    try {
      setIsRequesting(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "request",
        args: [
          selectedPosition.asset,
          BigInt(shares * 10 ** 6),
          BigInt(minimumDuration * 24 * 60 * 60),
          !!proxyAddress,
        ],
      });
      setRequestTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      onError?.(message);
    } finally {
      setIsRequesting(false);
    }
  };

  const giveApproval = async () => {
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
      onError?.(message);
    } finally {
      setIsApproving(false);
    }
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxShares = selectedPosition?.totalBought ?? 0;
    const newShares = Math.max(0, Math.min(maxShares, Number(e.target.value)));
    setShares(newShares);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Request a Loan</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request a Loan</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {proxyAddress && (
              <PositionSelect
                address={proxyAddress}
                selectedPosition={selectedPosition}
                onPositionSelect={setSelectedPosition}
              />
            )}

            <div className="flex gap-2">
              <div className="grid gap-3">
                <Label htmlFor="shares">Shares</Label>
                <Input
                  className="w-full rounded-md"
                  type="number"
                  placeholder="Shares"
                  value={shares}
                  onChange={handleSharesChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="value">Value</Label>
                <Input
                  className="w-full"
                  type="number"
                  placeholder="Value"
                  value={value.toFixed(2)}
                  disabled
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="minimumDuration">Minimum Duration Days</Label>
              <Input
                className="w-full"
                type="number"
                placeholder="Minimum Duration Days"
                value={minimumDuration}
                onChange={(e) => setMinimumDuration(Number(e.target.value))}
                min={0}
                max={1000}
                step={1}
                inputMode="numeric"
              />
            </div>
            {!requestIsEnabled &&
              proxyAddress &&
              !isOperatorApprovalLoading && (
                <InfoAlert text="You need to approve the contract to transfer your Polymarket positions before you can request a loan. Click 'Approve' first, then 'Request a Loan' once the approval is confirmed." />
              )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <div className="flex items-center gap-2">
              {!requestIsEnabled && !isOperatorApprovalLoading && (
                <Button
                  onClick={giveApproval}
                  disabled={
                    !proxyAddress || isApproving || isApprovalConfirming
                  }
                >
                  {isApproving || isApprovalConfirming
                    ? "Approving..."
                    : "Approve"}
                </Button>
              )}

              <Button
                onClick={requestLoan}
                disabled={
                  !selectedPosition ||
                  shares <= 0 ||
                  isRequesting ||
                  isRequestConfirming ||
                  !requestIsEnabled
                }
              >
                {isRequesting || isRequestConfirming
                  ? "Requesting..."
                  : "Request a Loan"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
