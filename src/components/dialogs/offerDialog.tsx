import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function OfferDialog({
  requestId,
  open,
  handleApproval,
  handleOffer,
  handleCancel,
}: {
  requestId: bigint;
  open: boolean;
  handleApproval: (amount: number) => void;
  handleOffer: (requestId: bigint, rate: number, loanAmount: number) => void;
  handleCancel: () => void;
}) {
  const [loanAmount, setLoanAmount] = useState(0);
  const [rate, setRate] = useState(0);
  return (
    <Dialog open={open}>
      <DialogTitle>Offer for request {requestId.toString()}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} className="py-1.5">
          <TextField
            label="Loan Amount"
            type="number"
            value={loanAmount.toString()}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
          <TextField
            label="Rate (APY)"
            type="number"
            value={rate.toString()}
            onChange={(e) => setRate(Number(e.target.value))}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleApproval(loanAmount)}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOffer(requestId, rate, loanAmount)}
          >
            Offer
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
