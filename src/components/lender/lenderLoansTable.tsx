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
import { useEffect, useState } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import TransferDialog from "../dialogs/transferDialog";
import Address from "../widgets/address";
import LoadingActionButton from "../widgets/loadingActionButton";
import Market from "../widgets/market";

export default function LenderLoansTable({
  lender,
  title,
  data,
  onActionSuccess,
}: {
  lender: `0x${string}`;
  data: AllLoanData;
  title?: string;
  borrower?: `0x${string}`;
  onActionSuccess?: (successText: string) => void;
}) {
  const [dataType, setDataType] = useState<"my" | "all">("my");
  const [transferringLoan, setTransferringLoan] = useState<{
    loanId: bigint;
    callTime: bigint;
  } | null>(null);
  let loans = data.loans;

  loans = loans.filter((loan: Loan) => loan.borrower !== lender);

  if (dataType === "my") {
    loans = loans.filter((loan: Loan) => loan.lender === lender);
  } else {
    loans = loans.filter((loan: Loan) => loan.lender !== lender);
  }

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [callingLoanId, setCallingLoanId] = useState<bigint | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callTxHash, setCallTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const { isLoading: isCallConfirming, isSuccess: isCallConfirmed } =
    useWaitForTransactionReceipt({ hash: callTxHash });

  const [reclaimingLoanId, setReclaimingLoanId] = useState<bigint | null>(null);
  const [isReclaiming, setIsReclaiming] = useState(false);
  const [reclaimTxHash, setReclaimTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const { isLoading: isReclaimConfirming, isSuccess: isReclaimConfirmed } =
    useWaitForTransactionReceipt({ hash: reclaimTxHash });

  useEffect(() => {
    if (isCallConfirmed) {
      onActionSuccess?.("Loan called successfully");
      setCallingLoanId(null);
      setCallTxHash(undefined);
    }
  }, [isCallConfirmed]);

  useEffect(() => {
    if (isReclaimConfirmed) {
      onActionSuccess?.("Collateral reclaimed successfully");
      setReclaimingLoanId(null);
      setReclaimTxHash(undefined);
    }
  }, [isReclaimConfirmed]);

  const handleCall = async (loanId: bigint) => {
    if (!walletClient || !publicClient) return;
    try {
      setCallingLoanId(loanId);
      setIsCalling(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "call",
        args: [loanId],
      });
      setCallTxHash(hash);
    } finally {
      setIsCalling(false);
    }
  };

  const handleReclaim = async (loanId: bigint) => {
    if (!walletClient || !publicClient) return;
    try {
      setReclaimingLoanId(loanId);
      setIsReclaiming(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "reclaim",
        args: [loanId, true],
      });
      setReclaimTxHash(hash);
    } finally {
      setIsReclaiming(false);
    }
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
          onSuccess={(text: string) => onActionSuccess?.(text)}
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
        <ToggleButton value="all">All Loans</ToggleButton>
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
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Collateral</TableCell>
              <TableCell align="right">Lent</TableCell>
              <TableCell align="right">Owed</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Time Left</TableCell>
              <TableCell align="right">Rate</TableCell>
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
                <TableCell align="center">
                  <div className="flex justify-end gap-2">
                    {dataType === "my" ? (
                      <>
                        <LoadingActionButton
                          variant="outlined"
                          color="primary"
                          disabled={
                            Number(loan.minimumDuration) -
                              (Date.now() / 1000 - Number(loan.startTime)) >=
                              0 ||
                            Number(loan.callTime) > 0 ||
                            (callingLoanId === loan.loanId &&
                              (isCalling || isCallConfirming))
                          }
                          onClick={() => handleCall(loan.loanId)}
                          loading={
                            callingLoanId === loan.loanId &&
                            (isCalling || isCallConfirming)
                          }
                        >
                          Call
                        </LoadingActionButton>
                        <LoadingActionButton
                          variant="outlined"
                          color="primary"
                          disabled={
                            Number(loan.callTime) === 0 ||
                            Number(loan.callTime) + 24 * 60 * 60 >
                              Number(Date.now() / 1000) ||
                            (reclaimingLoanId === loan.loanId &&
                              (isReclaiming || isReclaimConfirming))
                          }
                          onClick={() => handleReclaim(loan.loanId)}
                          loading={
                            reclaimingLoanId === loan.loanId &&
                            (isReclaiming || isReclaimConfirming)
                          }
                        >
                          Reclaim
                        </LoadingActionButton>
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
