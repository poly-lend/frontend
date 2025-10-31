import { LoanRequest } from "@/types/polyLend";
import { fetchRequests } from "@/utils/fetchRequests";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import OfferDialog from "./offerDialog";

export default function RequestsTable({
  address,
}: {
  address?: `0x${string}`;
}) {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  useEffect(() => {
    if (!publicClient) return;
    fetchRequests({ publicClient, address }).then(setRequests);
  }, [publicClient, address]);

  const [openOfferDialog, setOpenOfferDialog] = useState<boolean>(false);
  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">
        RequestsTable
      </h2>
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
          {selectedRequest && (
            <OfferDialog
              requestId={selectedRequest.requestId}
              open={openOfferDialog}
              handleOffer={() => {
                setOpenOfferDialog(false);
                selectRequest(null);
              }}
            />
          )}
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
