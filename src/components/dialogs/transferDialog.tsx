import { polylendAddress, usdcAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import { toSPYWAI } from "@/utils/convertors";
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
import { usePublicClient, useWalletClient } from "wagmi";

export type TransferDialogProps = {
  loanId: bigint;
  callTime: bigint;
  open: boolean;
  close: () => void;
};

export default function TransferDialog({
  loanId,
  callTime,
  open,
  close,
}: TransferDialogProps) {
  const [newRate, setNewRate] = useState<number>(0);
  const [amountAtCall, setAmountAtCall] = useState<bigint>(BigInt(0));

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

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

  const handleApproval = async () => {
    if (!walletClient || !publicClient) return;
    await walletClient.writeContract({
      address: usdcAddress as `0x${string}`,
      abi: usdcConfig.abi,
      functionName: "approve",
      args: [polylendAddress, amountAtCall],
    });
  };

  const handleTransfer = async () => {
    if (!walletClient || !publicClient) return;
    const rateInSPY = toSPYWAI(newRate / 100);
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "transfer",
      args: [loanId, rateInSPY],
    });
    close();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Transfer Loan {loanId.toString()}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="New rate (APY)"
            type="number"
            value={newRate}
            onChange={(e) => setNewRate(Number(e.target.value))}
          />
          <Button variant="contained" color="primary" onClick={handleApproval}>
            Approve
          </Button>
          <Button variant="contained" color="primary" onClick={handleTransfer}>
            Transfer
          </Button>
          <Button variant="contained" color="secondary" onClick={close}>
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
