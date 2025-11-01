import { LoanRequest } from "@/types/polyLend";
import { fetchRequestsWithOffers } from "@/utils/fetchRequests";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

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
    fetchRequestsWithOffers({ publicClient, address }).then(setRequests);
  }, [publicClient, address]);

  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">Requests</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-center">Request ID</th>
            <th className="text-center">Borrower</th>
            <th className="text-center">Collateral Amount</th>
            <th className="text-center">Minimum Duration</th>
            <th className="text-center">Offers</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <>
              <tr key={request.requestId.toString()}>
                <td className="text-center">{request.requestId.toString()}</td>
                <td className="text-center">{request.borrower}</td>
                <td className="text-right">
                  {request.collateralAmount.toString()}
                </td>
                <td className="text-right">
                  {request.minimumDuration.toString()}
                </td>
                <td className="text-right">
                  {request.offers.length.toString()}
                </td>
                <td className="text-right">
                  <Button
                    disabled={request.offers.length === 0}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      if (
                        selectedRequest &&
                        selectedRequest.requestId === request.requestId
                      ) {
                        selectRequest(null);
                      } else {
                        selectRequest(request);
                      }
                    }}
                  >
                    Offers
                  </Button>
                </td>
              </tr>
              {selectedRequest &&
                selectedRequest.requestId === request.requestId && (
                  <tr>
                    <td colSpan={6}>?</td>
                  </tr>
                )}
            </>
          ))}
        </tbody>
      </table>
    </>
  );
}
