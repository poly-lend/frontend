import { LoanOffer } from "@/types/polyLend";
import { toAPYText, toUSDCString } from "@/utils/convertors";
import Address from "../widgets/address";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RequestOffersNestedTable({
  offers,
}: {
  offers: LoanOffer[];
}) {
  return (
    <div style={{ width: "92%", margin: "0 auto" }}>
      <Table className="text-xs">
        <TableHeader className="border-b">
          <TableRow>
            <TableHead className="text-right">Lender</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.offerId.toString()}>
              <TableCell align="center">
                <Address address={offer.lender} />
              </TableCell>
              <TableCell align="right">
                {toUSDCString(offer.loanAmount)}
              </TableCell>
              <TableCell align="right">{toAPYText(offer.rate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
