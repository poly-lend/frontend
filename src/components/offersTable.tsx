import { AllLoanData } from "@/types/polyLend";
import { toUSDCString } from "@/utils/convertors";
import {
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
            <TableCell align="center">Loan Amount</TableCell>
            <TableCell align="center">Rate</TableCell>
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
                {toUSDCString(offer.loanAmount)} USDC
              </TableCell>
              <TableCell align="right">{offer.rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
