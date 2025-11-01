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
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import OfferDialog from "./offerDialog";

export default function RequestsListTable() {
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
        All Requests
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
      <table className="w-full">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Borrower</th>
            <th>Collateral Amount</th>
            <th>Minimum Duration</th>
            <th>Offers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.requestId.toString()}>
              <td>{request.requestId.toString()}</td>
              <td>{request.borrower}</td>
              <td>{request.collateralAmount.toString()}</td>
              <td>{request.minimumDuration.toString()}</td>
              <td>{request.offers.length.toString()}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
