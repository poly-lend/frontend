import { polylendAddress, polymarketTokensAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import useIsApprovedForAll from "@/hooks/useIsApprovedForAll";
import useProxyAddress from "@/hooks/useProxyAddress";
import { Position } from "@/types/polymarketPosition";
import { execSafeTransaction } from "@/utils/proxy";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
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
import { BaseError, encodeFunctionData } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import InfoAlert from "../widgets/infoAlert";
import LoadingActionButton from "../widgets/loadingActionButton";
import PositionSelect from "../widgets/positionSelect";

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
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      className="bg-gray-900/30 backdrop-blur-xs"
      slotProps={{ paper: { sx: { borderRadius: "8px" } } }}
    >
      <DialogTitle className="flex items-center justify-between">
        <p className="text-xl font-medium">Request a Loan</p>
        <IconButton
          onClick={close}
          size="small"
          className="text-gray-400 hover:text-white"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} className="py-1.5">
          {proxyAddress && (
            <PositionSelect
              address={proxyAddress}
              selectedPosition={selectedPosition}
              onPositionSelect={setSelectedPosition}
            />
          )}

          <>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Shares"
                value={shares}
                onChange={handleSharesChange}
              />
              <TextField
                fullWidth
                type="number"
                label="Value"
                value={value.toFixed(2)}
                disabled
              />
            </Box>
          </>

          <TextField
            fullWidth
            type="number"
            label="Minimum Duration Days"
            value={minimumDuration}
            onChange={(e) => setMinimumDuration(Number(e.target.value))}
            slotProps={{
              input: {
                inputProps: {
                  min: 0,
                },
              },
            }}
          />
        </Stack>
        {!requestIsEnabled && proxyAddress && !isOperatorApprovalLoading && (
          <InfoAlert text="You need to approve the contract to transfer your Polymarket positions before you can request a loan. Click 'Approve' first, then 'Request a Loan' once the approval is confirmed." />
        )}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", px: 3, pb: 3, pt: 0 }}
      >
        <Button variant="outlined" color="secondary" onClick={close}>
          Cancel
        </Button>
        <div className="flex items-center gap-2">
          {!requestIsEnabled && !isOperatorApprovalLoading && (
            <LoadingActionButton
              variant="contained"
              color="primary"
              onClick={giveApproval}
              loading={isApproving || isApprovalConfirming}
              disabled={!proxyAddress || isApproving || isApprovalConfirming}
            >
              Approve
            </LoadingActionButton>
          )}

          <LoadingActionButton
            variant="contained"
            color="primary"
            onClick={requestLoan}
            loading={isRequesting || isRequestConfirming}
            disabled={
              !selectedPosition ||
              shares <= 0 ||
              isRequesting ||
              isRequestConfirming ||
              !requestIsEnabled
            }
          >
            Request a Loan
          </LoadingActionButton>
        </div>
      </DialogActions>
    </Dialog>
  );
}
