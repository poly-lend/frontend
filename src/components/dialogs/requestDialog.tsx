import { polylendAddress, polymarketTokensAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import useProxyAddress from "@/hooks/useProxyAddress";
import { Position } from "@/types/polymarketPosition";
import { execSafeTransaction } from "@/utils/proxy";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import PositionSelect from "../widgets/positionSelect";

export default function RequestDialog({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { data: proxyAddress } = useProxyAddress();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash,
    });

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
      setSnackbarOpen(false);
    }
  }, [open]);

  // Show success snackbar when loan request confirms
  useEffect(() => {
    if (isConfirmed) {
      setSnackbarOpen(true);
    }
  }, [isConfirmed]);

  const requestLoan = async () => {
    if (!walletClient || !publicClient || !selectedPosition) return;
    writeContract({
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
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>Request a loan</DialogTitle>
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
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={close}
          sx={{ mr: "auto" }}
        >
          Cancel
        </Button>
        {!isApprovalConfirmed ? (
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={giveApproval}
              disabled={!proxyAddress || isApproving || isApprovalConfirming}
            >
              Give Approval
            </Button>
            {(isApproving || isApprovalConfirming) && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        ) : (
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={requestLoan}
              disabled={
                !selectedPosition || shares <= 0 || isPending || isConfirming
              }
            >
              Request a Loan
            </Button>
            {(isPending || isConfirming) && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        )}
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Loan request submitted successfully
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
