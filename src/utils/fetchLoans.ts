import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { Loan } from "@/types/polyLend";

export const fetchLoans = async (params: {
  publicClient: any;
  borrowerAddress?: `0x${string}`;
  lenderAddress?: `0x${string}`;
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
      loanId: BigInt(index),
      borrower: loan.result[0] as `0x${string}`,
      borrowerWallet: loan.result[1],
      lender: loan.result[2] as `0x${string}`,
      positionId: BigInt(loan.result[3]),
      collateralAmount: BigInt(loan.result[4]),
      loanAmount: BigInt(loan.result[5]),
      rate: BigInt(loan.result[6]),
      startTime: BigInt(loan.result[7]),
      minimumDuration: BigInt(loan.result[8]),
      callTime: BigInt(loan.result[9]),
    }))

    .filter(
      (loan: Loan) =>
        loan.borrower !== `0x0000000000000000000000000000000000000000`
    );
  if (params.borrowerAddress) {
    loans = loans.filter(
      (loan: Loan) =>
        loan.borrower.toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }

  if (params.lenderAddress) {
    loans = loans.filter(
      (loan: Loan) =>
        loan.lender.toLowerCase() === params.lenderAddress?.toLocaleLowerCase()
    );
  }
  return loans;
};
