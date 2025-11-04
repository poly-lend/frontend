import { Loan } from "@/types/polyLend";
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

export default function LoansTable({
  borrowerAddress,
  lenderAddress,
}: {
  borrowerAddress?: `0x${string}`;
  lenderAddress?: `0x${string}`;
}) {
  const publicClient = usePublicClient();
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    if (!publicClient) return;
    fetchLoans({ publicClient, borrowerAddress, lenderAddress }).then(setLoans);
  }, [publicClient, borrowerAddress, lenderAddress]);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">Loans</h2>
      </div>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loan#</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Lender</TableCell>
              <TableCell>Shares</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.loanId}>
                <TableCell>{loan.loanId}</TableCell>
                <TableCell>{loan.borrower}</TableCell>
                <TableCell>{loan.lender}</TableCell>
                <TableCell>{loan.collateralAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
