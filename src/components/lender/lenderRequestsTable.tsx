import { AllLoanData, LoanRequest } from "@/types/polyLend";
import { toDuration, toSharesText, toUSDCString } from "@/utils/convertors";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import OfferDialog from "../dialogs/offerDialog";
import Address from "../widgets/address";
import Market from "../widgets/market";

export default function RequestsListTable({
  title,
  data,
  userAddress,
  onRequestSuccess,
}: {
  title?: string;
  data: AllLoanData;
  userAddress: `0x${string}`;
  onRequestSuccess?: (successText: string) => void;
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

  const handleOfferSuccess = async (successText: string) => {
    onRequestSuccess?.(successText);
    setOpenOfferDialog(false);
    selectRequest(null);
  };

  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">
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
              requestId={selectedRequest.requestId}
              open={openOfferDialog}
              close={closeOfferDialog}
            />
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Borrower</TableCell>
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
                <TableRow key={request.requestId}>
                  <TableCell align="center">
                    <Address address={request.borrower} />
                  </TableCell>
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
                    {toDuration(Number(request.minimumDuration))}
                  </TableCell>
                  <TableCell align="right">{request.offers.length}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        selectRequest(request);
                        setOpenOfferDialog(true);
                      }}
                    >
                      Offer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
