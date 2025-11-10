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
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { usePublicClient, useWalletClient } from "wagmi";
import Address from "../widgets/address";
import Market from "../widgets/market";

export default function LenderOffersTable({
  title,
  data,
}: {
  title?: string;
  data: AllLoanData;
}) {
  const offers = data.offers;
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const cancelOffer = async (offerId: bigint) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "cancelOffer",
      args: [offerId],
    });
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
              <TableCell align="center">Shares</TableCell>
              <TableCell align="center">Collateral</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Rate</TableCell>
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
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => cancelOffer(offer.offerId)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
