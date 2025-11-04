import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
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

export default function RequestsTable({
  address,
}: {
  address?: `0x${string}`;
}) {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  useEffect(() => {
    if (!publicClient) return;
    fetchRequestsWithOffers({ publicClient, address }).then(setRequests);
  }, [publicClient, address]);

  const acceptOffer = async (offerId: bigint) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "accept",
      args: [offerId],
    });
  };
  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">Requests</h2>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className="text-center">Request ID</TableCell>
            <TableCell className="text-center">Borrower</TableCell>
            <TableCell className="text-center">Collateral Amount</TableCell>
            <TableCell className="text-center">Minimum Duration</TableCell>
            <TableCell className="text-center">Offers</TableCell>
            <TableCell className="text-center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.requestId.toString()}>
              <TableCell className="text-center">
                {request.requestId.toString()}
              </TableCell>
              <TableCell className="text-center">{request.borrower}</TableCell>
              <TableCell className="text-right">
                {request.collateralAmount.toString()}
              </TableCell>
              <TableCell className="text-right">
                {request.minimumDuration.toString()}
              </TableCell>
              <TableCell className="text-right">
                {request.offers.length.toString()}
              </TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
            //   {selectedRequest &&
            //     selectedRequest.requestId === request.requestId && (
            //       <tr>
            //         <td colSpan={6}>
            //           <table className="w-full">
            //             <thead>
            //               <tr>
            //                 <th>Offer ID</th>
            //                 <th>Lender</th>
            //                 <th>Loan Amount</th>
            //                 <th>Rate</th>
            //               </tr>
            //             </thead>
            //             <tbody>
            //               {request.offers.map((offer) => (
            //                 <tr key={offer.offerId.toString()}>
            //                   <td className="text-center">
            //                     {offer.offerId.toString()}
            //                   </td>
            //                   <td>{offer.lender}</td>
            //                   <td className="text-right">
            //                     {formatUnits(offer.loanAmount, usdcDecimals)}{" "}
            //                     USDC
            //                   </td>
            //                   <td className="text-right">
            //                     {(
            //                       offer.rate - BigInt(10 ** polylendDecimals)
            //                     ).toString()}
            //                     %
            //                   </td>
            //                   <td className="text-right">
            //                     <Button
            //                       variant="outlined"
            //                       color="primary"
            //                       onClick={() => acceptOffer(offer.offerId)}
            //                     >
            //                       Accept
            //                     </Button>
            //                   </td>
            //                 </tr>
            //               ))}
            //             </tbody>
            //           </table>
            //         </td>
            //       </tr>
            //     )}
            // </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
