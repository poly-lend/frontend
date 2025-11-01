import { LoanRequest } from "@/types/polyLend";
import { fetchRequests } from "@/utils/fetchRequests";
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
    fetchRequests({ publicClient, address }).then(setRequests);
  }, [publicClient, address]);

  const [openOfferDialog, setOpenOfferDialog] = useState<boolean>(false);
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
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.requestId.toString()}>
              <td className="text-center">{request.requestId.toString()}</td>
              <td className="text-center">{request.borrower}</td>
              <td className="text-right">
                {request.collateralAmount.toString()}
              </td>
              <td className="text-right">
                {request.minimumDuration.toString()}
              </td>
              <td className="text-right">{request.offers.length.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
