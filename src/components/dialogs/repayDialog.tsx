import { polylendAddress, usdcAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";

export type RepayDialogProps = {
  loanId: bigint;
  open: boolean;
  close: () => void;
};

export default function RepayDialog({ loanId, open, close }: RepayDialogProps) {
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const getAmountOwed = async () => {
      if (!publicClient) return;
      const amount = await publicClient.readContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "getAmountOwed",
        args: [loanId, timestamp],
      });
      setAmount(amount);
    };
    getAmountOwed();
  }, []);

  const handleApproval = async (amount: bigint) => {
    if (!walletClient || !publicClient) return;
    await walletClient.writeContract({
      address: usdcAddress as `0x${string}`,
      abi: usdcConfig.abi,
      functionName: "approve",
      args: [polylendAddress, amount],
    });
  };

  const handleRepay = async (loanId: bigint, timestamp: bigint) => {
    if (!walletClient || !publicClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "repay",
      args: [loanId, timestamp],
    });
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Repay Loan {loanId.toString()}</DialogTitle>
      <DialogContent>
        <TextField
          label="Loan ID"
          type="number"
          value={amount.toString()}
          disabled
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApproval(amount)}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRepay(loanId, timestamp)}
        >
          Offer
        </Button>
        <Button variant="contained" color="secondary" onClick={close}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
