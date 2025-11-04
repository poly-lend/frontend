import { polylendAddress, polylendDecimals, usdcDecimals } from "@/configs";
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
import { formatUnits } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

export default function RequestsTable({
  address,
  title,
}: {
  address?: `0x${string}`;
  title?: string;
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
      <h2 className="text-2xl font-bold w-full text-center mt-8">
        {title ? title : "Requests"}
      </h2>
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
            <>
              <TableRow key={request.requestId.toString()}>
                <TableCell className="text-center">
                  {request.requestId.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {request.borrower}
                </TableCell>
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
              {selectedRequest &&
                selectedRequest.requestId === request.requestId && (
                  <TableRow>
                    <TableCell colSpan={6} className="border-1">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Offer ID</TableCell>
                            <TableCell>Lender</TableCell>
                            <TableCell>Loan Amount</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {request.offers.map((offer) => (
                            <TableRow key={offer.offerId.toString()}>
                              <TableCell className="text-center">
                                {offer.offerId.toString()}
                              </TableCell>
                              <TableCell>{offer.lender}</TableCell>
                              <TableCell className="text-right">
                                {formatUnits(offer.loanAmount, usdcDecimals)}{" "}
                                USDC
                              </TableCell>
                              <TableCell className="text-right">
                                {(
                                  offer.rate - BigInt(10 ** polylendDecimals)
                                ).toString()}
                                %
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => acceptOffer(offer.offerId)}
                                >
                                  Accept
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
