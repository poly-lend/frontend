import { polylendAddress, usdcAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import { calculateMaxTransferRate } from "@/utils/calculations";
import { toAPYText, toSPYWAI } from "@/utils/convertors";
import { fetchAmountOwed } from "@/utils/fetchAmountOwed";
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

export type TransferDialogProps = {
  loanId: bigint;
  callTime: bigint;
  open: boolean;
  close: () => void;
  onSuccess?: (successText: string) => void;
};

export default function TransferDialog({
  loanId,
  callTime,
  open,
  close,
  onSuccess,
}: TransferDialogProps) {
  const [newRate, setNewRate] = useState<number>(0);
  const [amountAtCall, setAmountAtCall] = useState<bigint>(BigInt(0));

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isApproving, setIsApproving] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferTxHash, setTransferTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({ hash: approvalTxHash });
  const { isLoading: isTransferConfirming, isSuccess: isTransferConfirmed } =
    useWaitForTransactionReceipt({ hash: transferTxHash });

  useEffect(() => {
    const getAmountOwed = async () => {
      if (!publicClient || !open) return;
      const owed = await fetchAmountOwed({
        publicClient,
        loanId,
        timestamp: BigInt(callTime),
      });
      setAmountAtCall(owed);
    };
    getAmountOwed();
  }, [publicClient, open, loanId, callTime]);

  useEffect(() => {
    if (open) {
      setIsApproving(false);
      setApprovalTxHash(undefined);
      setIsTransferring(false);
      setTransferTxHash(undefined);
      setNewRate(0);
    }
  }, [open]);

  useEffect(() => {
    if (isTransferConfirmed) {
      close();
      onSuccess?.("Transfer submitted successfully");
    }
  }, [isTransferConfirmed]);

  const handleApproval = async () => {
    if (!walletClient || !publicClient) return;
    try {
      setIsApproving(true);
      const hash = await walletClient.writeContract({
        address: usdcAddress as `0x${string}`,
        abi: usdcConfig.abi,
        functionName: "approve",
        args: [polylendAddress, amountAtCall],
      });
      setApprovalTxHash(hash);
    } finally {
      setIsApproving(false);
    }
  };

  const handleTransfer = async () => {
    if (!walletClient || !publicClient) return;
    const rateInSPY = toSPYWAI(newRate / 100);
    try {
      setIsTransferring(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "transfer",
        args: [loanId, rateInSPY],
      });
      setTransferTxHash(hash);
    } finally {
      setIsTransferring(false);
    }
  };
  const maxTransferRate = calculateMaxTransferRate(callTime);
  console.log("maxTransferRate", maxTransferRate);
  return (
    <Dialog open={open}>
      <DialogTitle>Transfer Loan {loanId.toString()}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} className="py-1.5">
          <div>
            <TextField
              label="New rate (APY)"
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              className="text-gray-100"
            />
            <p className="text-sm text-gray-400 font-medium mt-0.5">
              Current max rate: {toAPYText(maxTransferRate)}
            </p>
          </div>

          {!isApprovalConfirmed ? (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={handleApproval}
              loading={isApproving || isApprovalConfirming}
              disabled={
                isApproving ||
                isApprovalConfirming ||
                amountAtCall === BigInt(0)
              }
              className="w-full"
            >
              Approve
            </LoadingActionButton>
          ) : (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={handleTransfer}
              loading={isTransferring || isTransferConfirming}
              disabled={isTransferring || isTransferConfirming || newRate <= 0}
              className="w-full"
            >
              Transfer
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
