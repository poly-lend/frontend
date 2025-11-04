import { AllLoanData } from "@/types/polyLend";
import { toDuration, toSharesText, toUSDCString } from "@/utils/convertors";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Address from "./address";
import MarketEntry from "./marketEntry";

export default function OffersTable({
  title,
  data,
}: {
  title?: string;
  data: AllLoanData;
}) {
  const offers = data.offers;

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          {title ? title : "Offers"}
        </h2>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Offer ID</TableCell>
            <TableCell align="center">Request ID</TableCell>
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
              <TableCell align="center">{offer.offerId.toString()}</TableCell>
              <TableCell align="center">{offer.requestId.toString()}</TableCell>
              <TableCell align="center">
                <Address address={offer.lender} />
              </TableCell>
              <TableCell align="center">
                <MarketEntry market={offer.market} />
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
              <TableCell align="right">{"10%"}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" color="primary">
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
