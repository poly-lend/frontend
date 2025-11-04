import { Loan } from "@/types/polyLend";
import { toPolymarketSharesString } from "@/utils/convertors";
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
              <TableCell align="center">Borrower</TableCell>
              <TableCell align="center">Lender</TableCell>
              <TableCell align="right">Shares</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.loanId}>
                <TableCell align="center">{loan.loanId}</TableCell>
                <TableCell align="center">
                  <Address address={loan.borrower} />
                </TableCell>
                <TableCell align="center">
                  <Address address={loan.lender} />
                </TableCell>
                <TableCell align="right">
                  {toPolymarketSharesString(loan.collateralAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
