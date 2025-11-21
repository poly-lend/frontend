import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData, LoanRequest } from "@/types/polyLend";
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

import LoadingActionButton from "../widgets/loadingActionButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function BorrowerRequestsTable({
  address,
  title,
  data,
  onActionSuccess,
  onActionError,
}: {
  address?: `0x${string}`;
  title?: string;
  data: AllLoanData;
  onActionSuccess?: (successText: string) => void;
  onActionError?: (errorText: string) => void;
}) {
  const requests = data.requests;
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [cancellingRequestId, setCancellingRequestId] = useState<bigint | null>(
    null
  );
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelTxHash, setCancelTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const { isLoading: isCancelConfirming, isSuccess: isCancelConfirmed } =
    useWaitForTransactionReceipt({
      hash: cancelTxHash,
    });

  const cancelRequest = async (requestId: bigint) => {
    if (!publicClient || !walletClient) return;
    try {
      setCancellingRequestId(requestId);
      setIsCancelling(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "cancelRequest",
        args: [requestId],
      });
      setCancelTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      onActionError?.(message);
      setCancellingRequestId(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const [acceptingOfferId, setAcceptingOfferId] = useState<bigint | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptTxHash, setAcceptTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const { isLoading: isAcceptConfirming, isSuccess: isAcceptConfirmed } =
    useWaitForTransactionReceipt({
      hash: acceptTxHash,
    });

  const acceptOffer = async (offerId: bigint) => {
    if (!publicClient || !walletClient) return;
    try {
      setAcceptingOfferId(offerId);
      setIsAccepting(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "accept",
        args: [offerId],
      });
      setAcceptTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      onActionError?.(message);
      setAcceptingOfferId(null);
    } finally {
      setIsAccepting(false);
    }
  };

  useEffect(() => {
    if (isCancelConfirmed) {
      onActionSuccess?.("Request canceled successfully");
      selectRequest(null);
      setCancellingRequestId(null);
      setCancelTxHash(undefined);
    }
  }, [isCancelConfirmed]);

  useEffect(() => {
    if (isAcceptConfirmed) {
      onActionSuccess?.("Offer accepted successfully");
      selectRequest(null);
      setAcceptingOfferId(null);
      setAcceptTxHash(undefined);
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
              <TableHead className="text-center"> Side </TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Collateral</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Offers</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <Fragment key={request.requestId.toString()}>
                <TableRow>
                  <TableCell align="center">
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
                    <div className="flex gap-2 justify-center">
                      <Button
                        disabled={request.offers.length === 0}
                        variant="outline"
                        className="hover:text-neutral-300"
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
                      <LoadingActionButton
                        variant="outline"
                        className="text-destructive hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => cancelRequest(request.requestId)}
                        loading={
                          cancellingRequestId === request.requestId &&
                          (isCancelling || isCancelConfirming)
                        }
                      >
                        Cancel
                      </LoadingActionButton>
                    </div>
                  </TableCell>
                </TableRow>
                {selectedRequest &&
                  selectedRequest.requestId === request.requestId && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Table>
                          <TableHeader className="border-b">
                            <TableRow>
                              <TableHead className="text-right">
                                Offer ID
                              </TableHead>
                              <TableHead className="text-right">
                                Lender
                              </TableHead>
                              <TableHead className="text-right">
                                Amount
                              </TableHead>
                              <TableHead className="text-right">Rate</TableHead>
                              <TableHead className="text-center">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
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
                                  {toUSDCString(offer.loanAmount)}
                                </TableCell>
                                <TableCell align="right">
                                  {toAPYText(offer.rate)}
                                </TableCell>
                                <TableCell align="center">
                                  <LoadingActionButton
                                    variant="outline"
                                    className="text-primary hover:bg-primary/20 hover:text-primary"
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
