import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData } from "@/types/polyLend";
import {
  toAPYText,
  toDuration,
  toSharesText,
  toUSDCString,
} from "@/utils/convertors";
import { Fragment, useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import Address from "../widgets/address";
import Market from "../widgets/market";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingActionButton from "../widgets/loadingActionButton";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export default function BorrowerRequestsTable({
  address,
  title,
  data,
  onDataRefresh,
}: {
  address?: `0x${string}`;
  title?: string;
  data: AllLoanData;
  onDataRefresh: () => void;
}) {
  const requests = data.requests;
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [acceptingOfferId, setAcceptingOfferId] = useState<bigint | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptTxHash, setAcceptTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const { isLoading: isAcceptConfirming, isSuccess: isAcceptConfirmed } =
    useWaitForTransactionReceipt({
      hash: acceptTxHash,
    });

  const acceptOffer = async (offerId: bigint, positionId: bigint) => {
    if (!publicClient || !walletClient) return;
    try {
      setAcceptingOfferId(offerId);
      setIsAccepting(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "accept",
        args: [offerId, BigInt(0), BigInt(0), positionId, true],
      });
      setAcceptTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      toast.error(message);
      setAcceptingOfferId(null);
    } finally {
      setIsAccepting(false);
    }
  };

  useEffect(() => {
    if (isAcceptConfirmed) {
      toast.success("Offer accepted successfully");
      selectRequest(null);
      setAcceptingOfferId(null);
      setAcceptTxHash(undefined);
      onDataRefresh();
    }
  }, [isAcceptConfirmed]);
  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">
        {title ? title : "Requests"}
      </h2>
      {requests.length === 0 && (
        <div className="text-center">No requests found</div>
      )}
      {requests.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Market</TableHead>
              <TableHead className="text-center">Side</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Collateral</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Offers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <Fragment key={request.requestId.toString()}>
                <TableRow>
                  <TableCell align="center" className="whitespace-normal">
                    <Market market={request.market} />
                  </TableCell>
                  <TableCell align="center">
                    <Badge
                      variant={
                        request.market.outcome === "Yes" ? "yes" : "destructive"
                      }
                    >
                      {request.market.outcome}
                    </Badge>
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
                    <div className="flex gap-2 justify-end">
                      <Button
                        disabled={request.offers.length === 0}
                        variant="outline"
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
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {selectedRequest &&
                  selectedRequest.requestId === request.requestId && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <Table>
                          <TableHeader className="border-b">
                            <TableRow>
                              <TableHead className="text-right">
                                Lender
                              </TableHead>
                              <TableHead className="text-right">
                                Amount
                              </TableHead>
                              <TableHead className="text-right">Rate</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {request.offers.map((offer) => (
                              <TableRow key={offer.offerId}>
                                <TableCell align="right">
                                  <Address address={offer.lender} />
                                </TableCell>
                                <TableCell align="right">
                                  {toUSDCString(offer.loanAmount)}
                                </TableCell>
                                <TableCell align="right">
                                  {toAPYText(offer.rate)}
                                </TableCell>
                                <TableCell align="right">
                                  <LoadingActionButton
                                    variant="outline-primary"
                                    onClick={() => acceptOffer(offer.offerId)}
                                    loading={
                                      acceptingOfferId === offer.offerId &&
                                      (isAccepting || isAcceptConfirming)
                                    }
                                  >
                                    Accept
                                  </LoadingActionButton>
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
