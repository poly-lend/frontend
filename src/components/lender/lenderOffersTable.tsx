import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData } from "@/types/polyLend";
import {
  toAPYText,
  toDuration,
  toSharesText,
  toUSDCString,
} from "@/utils/convertors";
import { useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import Address from "../widgets/address";
import LoadingActionButton from "../widgets/loadingActionButton";
import Market from "../widgets/market";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function LenderOffersTable({
  title,
  data,
  userAddress,
  onDataRefresh,
}: {
  title?: string;
  data: AllLoanData;
  userAddress: `0x${string}`;
  onDataRefresh: () => void;
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
      toast.success("Offer canceled successfully");
      onDataRefresh();
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
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      toast.error(message);
      setCancellingOfferId(null);
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Lender</TableHead>
              <TableHead className="text-center">Market</TableHead>
              <TableHead className="text-center"> Side </TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Collateral</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.offerId.toString()}>
                <TableCell align="right">
                  <Address address={offer.lender} />
                </TableCell>
                <TableCell align="center" className="whitespace-normal">
                  <Market market={offer.market} />
                </TableCell>
                <TableCell align="center">
                  <OutcomeBadge outcome={offer.market.outcome} />
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
                <TableCell align="right">
                  <LoadingActionButton
                    variant="outline-destructive"
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
