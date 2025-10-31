import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function OfferDialog({
  requestId,
  open,
  handleOffer,
}: {
  requestId: bigint;
  open: boolean;
  handleOffer: () => void;
}) {
  const [loanAmount, setLoanAmount] = useState<bigint>(BigInt(0));
  const [rate, setRate] = useState<bigint>(BigInt(0));
  return (
    <Dialog open={open}>
      <DialogTitle>Offer for request {requestId.toString()}</DialogTitle>
      <DialogContent>
        <TextField
          label="Loan Amount"
          type="number"
          value={loanAmount.toString()}
          onChange={(e) => setLoanAmount(BigInt(e.target.value))}
        />
        <TextField
          label="Rate"
          type="number"
          value={rate.toString()}
          onChange={(e) => setRate(BigInt(e.target.value))}
        />
        <Button variant="contained" color="primary" onClick={handleOffer}>
          Offer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
