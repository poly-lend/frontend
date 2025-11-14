import { LoanOffer } from "@/types/polyLend";
import { toAPYText, toUSDCString } from "@/utils/convertors";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Address from "../widgets/address";

export default function RequestOffersNestedTable({
  offers,
}: {
  offers: LoanOffer[];
}) {
  return (
    <div style={{ width: "92%", margin: "0 auto" }}>
      <Table
        size="small"
        sx={{
          "& td, & th": { fontSize: "0.8rem" },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="right">Lender</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((offer) => (
            <TableRow
              key={offer.offerId.toString()}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
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
