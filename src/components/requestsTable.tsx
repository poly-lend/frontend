import { polylendAddress, polylendDecimals, usdcDecimals } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { LoanRequest } from "@/types/polyLend";
import { convertToUSDCString, SecondsToDays } from "@/utils/convertors";
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
import Address from "./address";

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
            <TableCell align="center">Request ID</TableCell>
            <TableCell align="center">Borrower</TableCell>
            <TableCell align="center">Shares</TableCell>
            <TableCell align="center">Value</TableCell>
            <TableCell align="center">Min. Duration (days)</TableCell>
            <TableCell align="center">Offers</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <>
              <TableRow key={request.requestId.toString()}>
                <TableCell align="center">
                  {request.requestId.toString()}
                </TableCell>
                <TableCell align="center">
                  <Address address={request.borrower} />
                </TableCell>
                <TableCell align="right">
                  {Number(formatUnits(request.collateralAmount, 6)).toFixed(6)}
                </TableCell>
                <TableCell align="right">
                  {convertToUSDCString(request.collateralAmount)} USDC
                </TableCell>
                <TableCell align="right">
                  {SecondsToDays(Number(request.minimumDuration))}
                </TableCell>
                <TableCell align="right">
                  {request.offers.length.toString()}
                </TableCell>
                <TableCell align="right">
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
