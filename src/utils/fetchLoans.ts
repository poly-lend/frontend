import { Loan } from "@/types/polyLend";

export const fetchLoans = async (params: {
  publicClient: any;
  borrower?: `0x${string}`;
  lender?: `0x${string}`;
}): Promise<Loan[]> => {
  const url = `https://api.polylend.com/loans`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch loans: ${response.statusText}`);
  }
  const loansData = await response.json();

  let loans: Loan[] = loansData.map((loan: any) => ({
    loanId: loan._id,
    borrower: loan.borrower as `0x${string}`,
    borrowerWallet: loan.borrowerWallet as `0x${string}`,
    lender: loan.lender as `0x${string}`,
    positionId: loan.positionId,
    collateralAmount: loan.collateralAmount,
    loanAmount: loan.loanAmount,
    rate: loan.rate,
    startTime: loan.startTime,
    minimumDuration: loan.minimumDuration,
    callTime: loan.callTime,
  }));

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
