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
import { Fragment, useEffect, useState } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import Address from "../widgets/address";
import LoadingActionButton from "../widgets/loadingActionButton";
import Market from "../widgets/market";

export default function BorrowerRequestsTable({
  address,
  title,
  data,
  onActionSuccess,
}: {
  address?: `0x${string}`;
  title?: string;
  data: AllLoanData;
  onActionSuccess?: (successText: string) => void;
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
                      <LoadingActionButton
                        variant="outlined"
                        color="error"
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
                      <TableCell colSpan={6} sx={{ p: 0.5 }}>
                        <div style={{ width: "92%", margin: "0 auto" }}>
                          <Table
                            size="small"
                            sx={{
                              "& td, & th": { fontSize: "0.8rem", py: 0.5 },
                            }}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="right">Offer ID</TableCell>
                                <TableCell align="right">Lender</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Rate</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {request.offers.map((offer) => (
                                <TableRow
                                  key={offer.offerId}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
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
                                      variant="outlined"
                                      color="primary"
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
                        </div>
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
