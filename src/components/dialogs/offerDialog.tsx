import { polylendAddress, usdcAddress, usdcDecimals } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import { toSPYWAI } from "@/utils/convertors";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import LoadingActionButton from "../widgets/loadingActionButton";

export default function OfferDialog({
  requestId,
  open,
  close,
  onSuccess,
}: {
  requestId: bigint;
  open: boolean;
  close: () => void;
  onSuccess?: (successText: string) => void;
}) {
  const [loanAmount, setLoanAmount] = useState(0);
  const [rate, setRate] = useState(0);
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
      setLoanAmount(0);
      setRate(0);
    }
  }, [open]);

  useEffect(() => {
    if (isOfferConfirmed) {
      close();
      onSuccess?.("Offer submitted successfully");
    }
  }, [isOfferConfirmed]);

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
    } finally {
      setIsApproving(false);
    }
  };

  const handleOffer = async () => {
    if (!publicClient || !walletClient) return;
    const rateInSPY = toSPYWAI(rate / 100);
    const loanAmountInUSDC = loanAmount * 10 ** usdcDecimals;
    try {
      setIsOffering(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "offer",
        args: [requestId, BigInt(loanAmountInUSDC), rateInSPY],
      });
      setOfferTxHash(hash);
    } finally {
      setIsOffering(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Offer for request {requestId.toString()}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} className="py-1.5">
          <TextField
            label="Loan Amount"
            type="number"
            value={loanAmount.toString()}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
          <TextField
            label="Rate (APY)"
            type="number"
            value={rate.toString()}
            onChange={(e) => setRate(Number(e.target.value))}
          />
          {!isApprovalConfirmed ? (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={handleApproval}
              className="w-full"
              loading={isApproving || isApprovalConfirming}
              disabled={loanAmount <= 0 || isApproving}
            >
              Approve
            </LoadingActionButton>
          ) : (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={handleOffer}
              className="w-full"
              loading={isOffering || isOfferConfirming}
              disabled={loanAmount <= 0 || rate <= 0 || isOffering}
            >
              Offer
            </LoadingActionButton>
          )}
          <Button variant="contained" color="secondary" onClick={close}>
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
