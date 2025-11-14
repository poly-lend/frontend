import { polylendAddress, usdcAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import useErc20Allowance from "@/hooks/useErc20Allowance";
import { calculateMaxTransferRate } from "@/utils/calculations";
import { toAPYText, toSPYWAI } from "@/utils/convertors";
import { fetchAmountOwed } from "@/utils/fetchAmountOwed";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

  const { allowance } = useErc20Allowance(
    open,
    usdcAddress as `0x${string}`,
    polylendAddress as `0x${string}`,
    [isApprovalConfirmed]
  );

  const hasAnyAllowance = allowance > BigInt(0);
  const hasSufficientAllowance = allowance >= amountAtCall;
  const shouldShowTransfer =
    isApprovalConfirmed ||
    (amountAtCall === BigInt(0) ? hasAnyAllowance : hasSufficientAllowance);

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
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      className="bg-gray-900/30 backdrop-blur-xs"
      slotProps={{ paper: { sx: { borderRadius: "8px" } } }}
    >
      <DialogTitle className="flex items-center justify-between">
        <p className="text-xl font-medium">Transfer Loan {loanId.toString()}</p>
        <IconButton
          onClick={close}
          size="small"
          className="text-gray-400 hover:text-white"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} className="py-1.5">
          <div>
            <TextField
              label="New rate (APY)"
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              className="text-gray-100"
              fullWidth
            />
            <p className="text-sm text-gray-400 font-medium mt-1">
              Current max rate: {toAPYText(maxTransferRate)}
            </p>
          </div>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", px: 3, pb: 3, pt: 0 }}
      >
        <Button variant="outlined" color="secondary" onClick={close}>
          Cancel
        </Button>
        {!shouldShowTransfer ? (
          <LoadingActionButton
            variant="contained"
            color="primary"
            onClick={handleApproval}
            loading={isApproving || isApprovalConfirming}
            disabled={
              isApproving || isApprovalConfirming || amountAtCall === BigInt(0)
            }
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
          >
            Transfer
          </LoadingActionButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
