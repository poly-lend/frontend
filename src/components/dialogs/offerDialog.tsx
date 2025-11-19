import { polylendAddress, usdcAddress, usdcDecimals } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import useErc20Allowance from "@/hooks/useErc20Allowance";
import { toDuration, toSPYWAI } from "@/utils/convertors";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import LoadingActionButton from "../widgets/loadingActionButton";

export default function OfferDialog({
  requestId,
  loanDuration,
  open,
  close,
  onSuccess,
  onError,
}: {
  requestId: bigint;
  loanDuration: number;
  open: boolean;
  close: () => void;
  onSuccess?: (successText: string) => void;
  onError?: (errorText: string) => void;
}) {
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
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      onError?.(message);
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
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      className="bg-gray-900/30 backdrop-blur-xs"
      slotProps={{ paper: { sx: { borderRadius: "8px" } } }}
    >
      <DialogTitle className="flex items-center justify-between">
        <p className="text-xl font-medium">Make an Offer</p>
        <IconButton
          onClick={close}
          size="small"
          className="text-gray-400 hover:text-white"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-5 py-1.5">
          <TextField
            fullWidth
            label="Loan Amount (pfUSDC)"
            type="number"
            value={loanAmount.toString()}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            slotProps={{
              input: {
                inputProps: {
                  min: 0,
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Rate (APY)"
            type="number"
            value={rate.toString()}
            onChange={(e) => setRate(Number(e.target.value))}
            slotProps={{
              input: {
                inputProps: {
                  min: 0,
                },
              },
            }}
          />
        </div>
        {loanAmount > 0 && rate > 0 && (
          <div className="mt-3 rounded-lg border border-gray-700/50 bg-gray-800/30 px-3 py-2.5">
            <p className="text-sm text-gray-300">
              You will receive{" "}
              <span className="font-semibold text-[#d7ad4d]">
                {(
                  loanAmount +
                  (loanAmount * rate * loanDuration) / (100 * 31536000)
                ).toFixed(2)}{" "}
                pfUSDC
              </span>{" "}
              after the {toDuration(loanDuration)} loan duration (principal +
              interest).
            </p>
          </div>
        )}
        {!offerIsEnabled && loanAmount > 0 && !isAllowanceLoading && (
          <Alert
            severity="info"
            className="mt-2"
            sx={{
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              "& .MuiAlert-message": {
                fontSize: "0.8rem",
              },
            }}
          >
            You need to approve the contract to spend your tokens before you can
            make an offer. Click "Approve" first, then "Offer" once the approval
            is confirmed.
          </Alert>
        )}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", px: 3, pb: 3, pt: 0 }}
      >
        <Button variant="outlined" color="secondary" onClick={close}>
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          {!offerIsEnabled && !isAllowanceLoading && (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={handleApproval}
              loading={isApproving || isApprovalConfirming}
              disabled={loanAmount <= 0 || isApproving || isApprovalConfirming}
            >
              Approve
            </LoadingActionButton>
          )}

          <LoadingActionButton
            variant="contained"
            color="primary"
            onClick={handleOffer}
            loading={isOffering || isOfferConfirming}
            disabled={
              loanAmount <= 0 || rate <= 0 || isOffering || !offerIsEnabled
            }
          >
            Offer
          </LoadingActionButton>
        </div>
      </DialogActions>
    </Dialog>
  );
}
