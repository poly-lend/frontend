import { polylendAddress, usdcAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
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

export type RepayDialogProps = {
  loanId: bigint;
  open: boolean;
  close: () => void;
  onSuccess?: (successText: string) => void;
};

export default function RepayDialog({
  loanId,
  open,
  close,
  onSuccess,
}: RepayDialogProps) {
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

  useEffect(() => {
    const getAmountOwed = async () => {
      if (!publicClient) return;
      const amount = await fetchAmountOwed({
        publicClient,
        loanId,
        timestamp,
      });
      setAmount(amount);
    };
    getAmountOwed();
  }, []);

  useEffect(() => {
    if (isRepayConfirmed) {
      close();
      onSuccess?.("Repayment submitted successfully");
    }
  }, [isRepayConfirmed]);

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
    } finally {
      setIsRepaying(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Repay Loan {loanId.toString()}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} className="py-1.5">
          <TextField
            label="Amount Owed"
            type="number"
            value={amount.toString()}
            disabled
          />
          {!isApprovalConfirmed ? (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={() => handleApproval(amount)}
              loading={isApproving || isApprovalConfirming}
              disabled={
                isApproving || isApprovalConfirming || amount === BigInt(0)
              }
              className="w-full"
            >
              Approve
            </LoadingActionButton>
          ) : (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={() => handleRepay(loanId, timestamp)}
              loading={isRepaying || isRepayConfirming}
              disabled={isRepaying || isRepayConfirming}
              className="w-full"
            >
              Repay
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
