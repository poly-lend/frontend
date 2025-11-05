import { AllLoanData } from "@/types/polyLend";
import { toDuration, toSharesText, toUSDCString } from "@/utils/convertors";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import Address from "../widgets/address";
import Market from "../widgets/market";

export default function LenderLoansTable({
  title,
  data,
}: {
  borrower?: `0x${string}`;
  lender?: `0x${string}`;
  title?: string;
  data: AllLoanData;
}) {
  const loans = data.loans;
  const [dataType, setDataType] = useState<"my" | "all">("my");
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          {title ? title : "Loans"}
        </h2>
      </div>
      {loans.length === 0 && <div className="text-center">No loans found</div>}
      {loans.length > 0 && (
        <div>
          <ToggleButtonGroup
            className="w-full flex justify-center mt-4"
            color="primary"
            size="small"
            value={dataType}
            exclusive
            onChange={(_, value) => setDataType(value)}
            aria-label="text alignment"
          >
            <ToggleButton value="my">My Loans</ToggleButton>
            <ToggleButton value="all">All Loans</ToggleButton>
          </ToggleButtonGroup>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Borrower</TableCell>
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
              {loans.map((loan) => (
                <TableRow key={loan.loanId}>
                  <TableCell align="center">
                    <Address address={loan.borrower} />
                  </TableCell>
                  <TableCell align="center">
                    <Market market={loan.market} />
                  </TableCell>
                  <TableCell align="right">
                    {toSharesText(loan.collateralAmount)}
                  </TableCell>
                  <TableCell align="right">
                    {toUSDCString(
                      Number(loan.market.outcomePrice) *
                        Number(loan.collateralAmount)
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {toUSDCString(loan.loanAmount)}
                  </TableCell>
                  <TableCell align="right">
                    {toDuration(Number(loan.minimumDuration))}
                  </TableCell>
                  <TableCell align="right">{"10%"}</TableCell>
                  <TableCell align="right">
                    {/* <Button variant="outlined" color="primary">
                      Transfer
                    </Button>
                    <Button variant="outlined" color="primary">
                      Call
                    </Button> */}
                    <Button variant="outlined" color="primary" disabled>
                      Reclaim
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
