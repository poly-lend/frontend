import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData } from "@/types/polyLend";
import {
  toAPYText,
  toDuration,
  toSharesText,
  toUSDCString,
} from "@/utils/convertors";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import Address from "../widgets/address";
import LoadingActionButton from "../widgets/loadingActionButton";
import Market from "../widgets/market";

export default function LenderOffersTable({
  title,
  data,
  userAddress,
  onCancelOfferSuccess,
}: {
  title?: string;
  data: AllLoanData;
  userAddress: `0x${string}`;
  onCancelOfferSuccess?: (successText: string) => void;
}) {
  let offers = data.offers;
  offers = offers.filter((offer) => offer.lender === userAddress);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [cancellingOfferId, setCancellingOfferId] = useState<bigint | null>(
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

  useEffect(() => {
    if (isCancelConfirmed) {
      onCancelOfferSuccess?.("Offer canceled successfully");
      setCancellingOfferId(null);
      setCancelTxHash(undefined);
    }
  }, [isCancelConfirmed]);

  const cancelOffer = async (offerId: bigint) => {
    if (!publicClient || !walletClient) return;
    try {
      setCancellingOfferId(offerId);
      setIsCancelling(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "cancelOffer",
        args: [offerId],
      });
      setCancelTxHash(hash);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          {title ? title : "Offers"}
        </h2>
      </div>
      {offers.length === 0 && (
        <div className="text-center mt-4">No offers found</div>
      )}
      {offers.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Lender</TableCell>
              <TableCell align="center">Market</TableCell>
              <TableCell align="center"> Side </TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Collateral</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.offerId.toString()}>
                <TableCell align="center">
                  <Address address={offer.lender} />
                </TableCell>
                <TableCell align="center">
                  <Market market={offer.market} />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={offer.market.outcome}
                    size="small"
                    color={offer.market.outcome === "Yes" ? "success" : "error"}
                  />
                </TableCell>
                <TableCell align="right">
                  {toSharesText(offer.request!.collateralAmount)}
                </TableCell>
                <TableCell align="right">
                  {toUSDCString(
                    Number(offer.market.outcomePrice) *
                      Number(offer.request!.collateralAmount)
                  )}
                </TableCell>
                <TableCell align="right">
                  {toUSDCString(offer.loanAmount)}
                </TableCell>
                <TableCell align="right">
                  {toDuration(Number(offer.request!.minimumDuration))}
                </TableCell>
                <TableCell align="right">{toAPYText(offer.rate)}</TableCell>
                <TableCell align="center">
                  <LoadingActionButton
                    variant="outlined"
                    color="error"
                    onClick={() => cancelOffer(offer.offerId)}
                    loading={
                      cancellingOfferId === offer.offerId &&
                      (isCancelling || isCancelConfirming)
                    }
                  >
                    Cancel
                  </LoadingActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
