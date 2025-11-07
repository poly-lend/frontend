import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { Loan } from "@/types/polyLend";

export const fetchLoans = async (params: {
  publicClient: any;
  borrower?: `0x${string}`;
  lender?: `0x${string}`;
}): Promise<Loan[]> => {
  const calls = [];
  for (var i = 0; i < 100; i++) {
    calls.push({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "loans",
      args: [i],
    });
  }
  const loansData = await params.publicClient.multicall({
    contracts: calls,
  });

  let loans: Loan[] = loansData
    .map((loan: any, index: number) => ({
      loanId: BigInt(loan.result[0]),
      borrower: loan.result[1] as `0x${string}`,
      borrowerWallet: loan.result[2],
      lender: loan.result[3] as `0x${string}`,
      positionId: BigInt(loan.result[4]),
      collateralAmount: BigInt(loan.result[5]),
      loanAmount: BigInt(loan.result[6]),
      rate: BigInt(loan.result[7]),
      startTime: BigInt(loan.result[8]),
      minimumDuration: BigInt(loan.result[9]),
      callTime: BigInt(loan.result[10]),
    }))

    .filter(
      (loan: Loan) =>
        loan.borrower !== `0x0000000000000000000000000000000000000000`
    );
  if (params.borrower) {
    loans = loans.filter(
      (loan: Loan) =>
        loan.borrower.toLowerCase() === params.borrower?.toLocaleLowerCase()
    );
  }

  if (params.lender) {
    loans = loans.filter(
      (loan: Loan) =>
        loan.lender.toLowerCase() === params.lender?.toLocaleLowerCase()
    );
  }

  return loans;
};
