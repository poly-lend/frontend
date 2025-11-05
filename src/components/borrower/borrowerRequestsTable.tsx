import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData, LoanRequest } from "@/types/polyLend";
import { toDuration, toSharesText, toUSDCString } from "@/utils/convertors";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import Address from "../widgets/address";
import Market from "../widgets/market";

export default function BorrowerRequestsTable({
  address,
  title,
  data,
}: {
  address?: `0x${string}`;
  title?: string;
  data: AllLoanData;
}) {
  const requests = data.requests;
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const cancelRequest = async (requestId: bigint) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "cancelRequest",
      args: [requestId],
    });
  };

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
      {requests.length === 0 && (
        <div className="text-center">No requests found</div>
      )}
      {requests.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Market</TableCell>
              <TableCell align="center">Shares</TableCell>
              <TableCell align="center">Collateral</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Offers</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <>
                <TableRow key={request.requestId.toString()}>
                  <TableCell align="center">
                    <Market market={request.market} />
                  </TableCell>
                  <TableCell align="right">
                    {toSharesText(request.collateralAmount)}
                  </TableCell>
                  <TableCell align="right">
                    {toUSDCString(
                      Number(request.market.outcomePrice) *
                        Number(request.collateralAmount)
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {toDuration(request.minimumDuration)}
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
                      Offers{" "}
                      {selectedRequest?.requestId === request.requestId ? (
                        <ArrowDropUp />
                      ) : (
                        <ArrowDropDown />
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => cancelRequest(request.requestId)}
                    >
                      Cancel
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
                              <TableCell align="center">Offer ID</TableCell>
                              <TableCell align="center">Lender</TableCell>
                              <TableCell align="center">Amount</TableCell>
                              <TableCell align="center">Rate</TableCell>
                              <TableCell align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {request.offers.map((offer) => (
                              <TableRow key={offer.offerId}>
                                <TableCell className="text-center">
                                  {offer.offerId}
                                </TableCell>
                                <TableCell align="center">
                                  <Address address={offer.lender} />
                                </TableCell>
                                <TableCell align="right">
                                  {toUSDCString(offer.loanAmount)} USDC
                                </TableCell>
                                <TableCell align="right">{"10%"}</TableCell>
                                <TableCell align="right">
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
      )}
    </>
  );
}
