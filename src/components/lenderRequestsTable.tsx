import {
  polylendAddress,
  polylendDecimals,
  usdcAddress,
  usdcDecimals,
} from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { usdcConfig } from "@/contracts/usdc";
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
import { usePublicClient, useWalletClient } from "wagmi";
import Address from "./address";
import MarketEntry from "./marketEntry";
import OfferDialog from "./offerDialog";

export default function RequestsListTable({
  title,
  data,
}: {
  title?: string;
  data: AllLoanData;
}) {
  const requests = data.requests;
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const handleApproval = async (amount: number) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: usdcAddress as `0x${string}`,
      abi: usdcConfig.abi,
      functionName: "approve",
      args: [polylendAddress, BigInt(amount * 10 ** usdcDecimals)],
    });
  };

  const handleOffer = async (
    requestId: bigint,
    rate: number,
    loanAmount: number
  ) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "offer",
      args: [
        requestId,
        BigInt(loanAmount * 10 ** usdcDecimals),
        BigInt(rate * 10 ** polylendDecimals),
      ],
    });
    setOpenOfferDialog(false);
    selectRequest(null);
  };

  const [openOfferDialog, setOpenOfferDialog] = useState<boolean>(false);
  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">
        {title ? title : "All Borrow Requests"}
      </h2>
      {selectedRequest && (
        <OfferDialog
          requestId={selectedRequest.requestId}
          open={openOfferDialog}
          handleOffer={handleOffer}
          handleApproval={handleApproval}
          handleCancel={() => {
            setOpenOfferDialog(false);
            selectRequest(null);
          }}
        />
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Request ID</TableCell>
            <TableCell align="center">Borrower</TableCell>
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
            <TableRow key={request.requestId}>
              <TableCell align="center">{request.requestId}</TableCell>
              <TableCell align="center">
                <Address address={request.borrower} />
              </TableCell>
              <TableCell align="center">
                <MarketEntry market={request.market} />
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
              <TableCell align="right">
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
  );
}
