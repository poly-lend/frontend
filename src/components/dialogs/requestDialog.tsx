import { polylendAddress, polymarketTokensAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import useProxyAddress from "@/hooks/useProxyAddress";
import { Position } from "@/types/polymarketPosition";
import { execSafeTransaction } from "@/utils/proxy";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import PositionSelect from "../widgets/positionSelect";

export default function RequestDialog({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const { data: proxyAddress } = useProxyAddress();
  const [selectedPosition, selectPosition] = useState<Position | null>(null);
  const [shares, setShares] = useState(0);
  const [minimumDuration, setMinimumDuration] = useState(10);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const value = selectedPosition ? shares * selectedPosition.curPrice : 0;

  useEffect(() => {
    if (selectedPosition) {
      setShares(selectedPosition.totalBought);
    }
  }, [selectedPosition]);

  const requestLoan = async () => {
    if (!walletClient || !publicClient || !selectedPosition) return;
    walletClient.writeContract({
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
    await execSafeTransaction({
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
              selectPosition={selectPosition}
            />
          )}

          {selectedPosition && (
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
          )}

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
        <Button
          variant="contained"
          color="primary"
          onClick={giveApproval}
          disabled={!selectedPosition}
        >
          Give Approval
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={requestLoan}
          disabled={!selectedPosition || shares <= 0}
        >
          Request a Loan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
