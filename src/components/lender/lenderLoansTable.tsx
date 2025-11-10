import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData, Loan } from "@/types/polyLend";
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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import TransferDialog from "../dialogs/transferDialog";
import Address from "../widgets/address";
import Market from "../widgets/market";

export default function LenderLoansTable({
  lender,
  title,
  data,
}: {
  lender: `0x${string}`;
  data: AllLoanData;
  title?: string;
  borrower?: `0x${string}`;
}) {
  const [dataType, setDataType] = useState<"my" | "others">("my");
  const [transferringLoan, setTransferringLoan] = useState<{
    loanId: bigint;
    callTime: bigint;
  } | null>(null);
  let loans = data.loans;

  console.log("loans", loans);

  if (dataType === "my") {
    loans = loans.filter((loan: Loan) => loan.lender === lender);
  } else {
    loans = loans.filter((loan: Loan) => loan.lender !== lender);
  }

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const handleCall = async (loanId: bigint) => {
    if (!walletClient || !publicClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "call",
      args: [loanId],
    });
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          {title ? title : "Loans"}
        </h2>
      </div>

      {transferringLoan !== null && (
        <TransferDialog
          loanId={transferringLoan.loanId}
          callTime={transferringLoan.callTime}
          open={transferringLoan !== null}
          close={() => setTransferringLoan(null)}
        />
      )}

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
        <ToggleButton value="others">Other's Loans</ToggleButton>
      </ToggleButtonGroup>
      {loans.length === 0 && (
        <div className="text-center mt-4">No loans found</div>
      )}
      {loans.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Borrower</TableCell>
              <TableCell align="center">Market</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Shares</TableCell>
              <TableCell align="center">Collateral</TableCell>
              <TableCell align="center">Lent</TableCell>
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
                  <Address address={loan.borrower} />
                </TableCell>
                <TableCell align="center">
                  <Market market={loan.market} />
                </TableCell>
                <TableCell align="center">
                  {loan.callTime > 0 ? "Called" : "Active"}
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
                  {loan.callTime > 0
                    ? toDuration(
                        Number(loan.callTime) +
                          24 * 60 * 60 -
                          Number(Date.now() / 1000)
                      )
                    : toDuration(
                        Number(loan.minimumDuration) -
                          (Date.now() / 1000 - Number(loan.startTime))
                      )}
                </TableCell>
                <TableCell align="right">{toAPYText(loan.rate)}</TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    {dataType === "my" ? (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={
                            Number(loan.minimumDuration) -
                              (Date.now() / 1000 - Number(loan.startTime)) >=
                              0 || Number(loan.callTime) > 0
                          }
                          onClick={() => handleCall(loan.loanId)}
                        >
                          Call
                        </Button>
                        <Button variant="outlined" color="primary" disabled>
                          Reclaim
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={Number(loan.callTime) == 0}
                          onClick={() =>
                            setTransferringLoan({
                              loanId: loan.loanId,
                              callTime: loan.callTime,
                            })
                          }
                        >
                          Transfer
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
