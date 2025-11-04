import { Loan } from "@/types/polyLend";
import { toDuration, toSharesText, toUSDCString } from "@/utils/convertors";
import { fetchLoans } from "@/utils/fetchLoans";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import Address from "./address";
import MarketEntry from "./marketEntry";

export default function LoansTable({
  borrower,
  lender,
  title,
}: {
  borrower?: `0x${string}`;
  lender?: `0x${string}`;
  title?: string;
}) {
  const publicClient = usePublicClient();
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    if (!publicClient) return;
    fetchLoans({ publicClient, borrower, lender }).then(setLoans);
  }, [publicClient, borrower, lender]);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          {title ? title : "Loans"}
        </h2>
      </div>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Loan ID</TableCell>
              <TableCell align="center">Lender</TableCell>
              <TableCell align="center">Borrower</TableCell>
              <TableCell align="center">Market</TableCell>
              <TableCell align="center">Shares</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.loanId}>
                <TableCell align="center">{loan.loanId}</TableCell>
                <TableCell align="center">
                  <Address address={loan.lender} />
                </TableCell>
                <TableCell align="center">
                  <Address address={loan.borrower} />
                </TableCell>
                <TableCell align="center">
                  <MarketEntry market={loan.market} />
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
                  {toDuration(Number(loan.minimumDuration))}
                </TableCell>
                <TableCell align="right">{loan.rate.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
