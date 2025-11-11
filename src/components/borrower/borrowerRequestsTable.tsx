import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData, LoanRequest } from "@/types/polyLend";
import {
  toAPYText,
  toDuration,
  toSharesText,
  toUSDCString,
} from "@/utils/convertors";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, useState } from "react";
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
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Collateral</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Offers</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <Fragment key={request.requestId.toString()}>
                <TableRow>
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
                    <div className="flex gap-2 justify-center">
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
                    </div>
                  </TableCell>
                </TableRow>
                {selectedRequest &&
                  selectedRequest.requestId === request.requestId && (
                    <TableRow>
                      <TableCell colSpan={6} className="border">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell align="right">Offer ID</TableCell>
                              <TableCell align="right">Lender</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell align="right">Rate</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {request.offers.map((offer) => (
                              <TableRow key={offer.offerId}>
                                <TableCell align="right">
                                  {offer.offerId}
                                </TableCell>
                                <TableCell align="right">
                                  <Address address={offer.lender} />
                                </TableCell>
                                <TableCell align="right">
                                  {toUSDCString(offer.loanAmount)} USDC
                                </TableCell>
                                <TableCell align="right">
                                  {toAPYText(offer.rate)}
                                </TableCell>
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
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
