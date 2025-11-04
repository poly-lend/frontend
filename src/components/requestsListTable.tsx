import {
  polylendAddress,
  polylendDecimals,
  usdcAddress,
  usdcDecimals,
} from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
import { LoanRequest } from "@/types/polyLend";
import { fetchRequestsWithOffers } from "@/utils/fetchRequests";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import OfferDialog from "./offerDialog";

export default function RequestsListTable({ title }: { title?: string }) {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  useEffect(() => {
    if (!publicClient) return;
    fetchRequestsWithOffers({ publicClient }).then(setRequests);
  }, [publicClient]);

  const handleApproval = async (amount: number) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: usdcAddress as `0x${string}`,
      abi: usdcConfig.abi,
      functionName: "approve",
      args: [polylendAddress, BigInt(amount * 10 ** usdcDecimals)],
    });
  };

  const handleOffer = async (
    requestId: bigint,
    rate: number,
    loanAmount: number
  ) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "offer",
      args: [
        requestId,
        BigInt(loanAmount * 10 ** usdcDecimals),
        BigInt(rate * 10 ** polylendDecimals),
      ],
    });
    setOpenOfferDialog(false);
    selectRequest(null);
  };

  const [openOfferDialog, setOpenOfferDialog] = useState<boolean>(false);
  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">
        {title ? title : "All Requests"}
      </h2>
      {selectedRequest && (
        <OfferDialog
          requestId={selectedRequest.requestId}
          open={openOfferDialog}
          handleOffer={handleOffer}
          handleApproval={handleApproval}
          handleCancel={() => {
            setOpenOfferDialog(false);
            selectRequest(null);
          }}
        />
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Request ID</TableCell>
            <TableCell>Borrower</TableCell>
            <TableCell>Collateral Amount</TableCell>
            <TableCell>Minimum Duration</TableCell>
            <TableCell>Offers</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.requestId.toString()}>
              <TableCell>{request.requestId.toString()}</TableCell>
              <TableCell>{request.borrower}</TableCell>
              <TableCell>{request.collateralAmount.toString()}</TableCell>
              <TableCell>{request.minimumDuration.toString()}</TableCell>
              <TableCell>{request.offers.length.toString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    selectRequest(request);
                    setOpenOfferDialog(true);
                  }}
                >
                  Offer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
