import { AllLoanData, LoanRequest } from "@/types/polyLend";
import { toDuration, toSharesText, toUSDCString } from "@/utils/convertors";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Button,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, useState } from "react";
import OfferDialog from "../dialogs/offerDialog";
import Address from "../widgets/address";
import Market from "../widgets/market";
import RequestOffersNestedTable from "./requestOffersNestedTable";

export default function RequestsListTable({
  title,
  data,
  userAddress,
  onRequestSuccess,
  onRequestError,
}: {
  title?: string;
  data: AllLoanData;
  userAddress: string | undefined;
  onRequestSuccess?: (successText: string) => void;
  onRequestError?: (errorText: string) => void;
}) {
  let requests = data.requests;
  requests = requests.filter(
    (request: LoanRequest) => request.borrower !== userAddress
  );
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);

  const [openOfferDialog, setOpenOfferDialog] = useState<boolean>(false);
  const closeOfferDialog = () => {
    setOpenOfferDialog(false);
    selectRequest(null);
  };

  const [expandedRequestIds, setExpandedRequestIds] = useState<Set<bigint>>(
    new Set()
  );
  const toggleExpanded = (requestId: bigint) => {
    setExpandedRequestIds((prev) => {
      const next = new Set(prev);
      if (next.has(requestId)) {
        next.delete(requestId);
      } else {
        next.add(requestId);
      }
      return next;
    });
  };

  const handleOfferSuccess = async (successText: string) => {
    onRequestSuccess?.(successText);
    setOpenOfferDialog(false);
    selectRequest(null);
  };

  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center">
        {title ? title : "All Borrow Requests"}
      </h2>
      {requests.length === 0 ? (
        <div className="text-center mt-4">No requests found</div>
      ) : (
        <>
          {selectedRequest && (
            <OfferDialog
              onSuccess={(successText: string) =>
                handleOfferSuccess(successText)
              }
              onError={onRequestError}
              requestId={selectedRequest.requestId}
              open={openOfferDialog}
              close={closeOfferDialog}
            />
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="right">Borrower</TableCell>
                <TableCell align="center">Market</TableCell>
                <TableCell align="center"> Side </TableCell>
                <TableCell align="right">Shares</TableCell>
                <TableCell align="right">Collateral</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Offers</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => {
                const isExpanded = expandedRequestIds.has(request.requestId);
                return (
                  <Fragment key={request.requestId.toString()}>
                    <TableRow>
                      <TableCell align="right">
                        <Address address={request.borrower} />
                      </TableCell>
                      <TableCell align="left">
                        <Market market={request.market} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={request.market.outcome}
                          size="small"
                          color={
                            request.market.outcome === "Yes"
                              ? "success"
                              : "error"
                          }
                        />
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
                        {toDuration(Number(request.minimumDuration))}
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex justify-end items-center gap-1">
                          {request.offers.length > 0 && (
                            <IconButton
                              size="small"
                              aria-label="expand offers"
                              onClick={() => toggleExpanded(request.requestId)}
                            >
                              {isExpanded ? (
                                <KeyboardArrowUpIcon fontSize="small" />
                              ) : (
                                <KeyboardArrowDownIcon fontSize="small" />
                              )}
                            </IconButton>
                          )}
                          <span>{request.offers.length}</span>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={!userAddress}
                          onClick={() => {
                            selectRequest(request);
                            setOpenOfferDialog(true);
                          }}
                        >
                          Offer
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell sx={{ p: 0.5 }} colSpan={8}>
                          <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <RequestOffersNestedTable offers={request.offers} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
