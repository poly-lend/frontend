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
  const publicClient = usePublicClient();
  useEffect(() => {
    if (!publicClient) return;
    fetchRequests({ publicClient, address }).then(setRequests);
  }, [publicClient, address]);

  return (
    <table>
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Borrower</th>

          <th>Collateral Amount</th>
          <th>Minimum Duration</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.requestId.toString()}>
            <td>{request.requestId.toString()}</td>
            <td>{request.borrower}</td>
            <td>{request.collateralAmount.toString()}</td>
            <td>{request.minimumDuration.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
