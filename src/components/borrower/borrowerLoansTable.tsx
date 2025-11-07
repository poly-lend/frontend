import { AllLoanData } from "@/types/polyLend";
import { calculateAmountOwed } from "@/utils/calculations";
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
import { useState } from "react";
import RepayDialog from "../dialogs/repayDialog";
import Address from "../widgets/address";
import Market from "../widgets/market";

export default function BorrowerLoansTable({
  title,
  data,
}: {
  borrower?: `0x${string}`;
  lender?: `0x${string}`;
  title?: string;
  data: AllLoanData;
}) {
  const loans = data.loans;

  const [selectedLoan, selectLoan] = useState<bigint | null>(null);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          {title ? title : "Loans"}
        </h2>
      </div>
      {selectedLoan !== null && (
        <RepayDialog
          loanId={selectedLoan}
          open={selectLoan != null}
          close={() => selectLoan(null)}
        />
      )}
      {loans.length === 0 && <div className="text-center">No loans found</div>}
      {loans.length > 0 && (
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Lender</TableCell>
                <TableCell align="center">Market</TableCell>
                <TableCell align="center">Shares</TableCell>
                <TableCell align="center">Collateral</TableCell>
                <TableCell align="center">Borrowed</TableCell>
                <TableCell align="center">Owed</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">Time Left</TableCell>
                <TableCell align="center">Rate</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.loanId}>
                  <TableCell align="center">
                    <Address address={loan.lender} />
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
                    {toUSDCString(
                      calculateAmountOwed(
                        Number(loan.loanAmount),
                        Number(loan.rate),
                        Number(loan.startTime)
                      )
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {toDuration(Number(loan.minimumDuration))}
                  </TableCell>
                  <TableCell align="right">
                    {toDuration(
                      Number(loan.minimumDuration) -
                        (Date.now() / 1000 - Number(loan.startTime))
                    )}
                  </TableCell>
                  <TableCell align="right">{toAPYText(loan.rate)}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => selectLoan(loan.loanId)}
                    >
                      Repay
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
