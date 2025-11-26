export type LoanOffer = {
  offerId: bigint;
  lender: `0x${string}`;
  loanAmount: bigint;
  rate: bigint;
  borrowedAmount: bigint;
  positionIds: bigint[];
  collateralAmount: bigint;
  minimumLoanAmount: bigint;
  duration: bigint;
  startTime: bigint;
  perpetual: boolean;
};

export type Loan = {
  loanId: bigint;
  borrower: `0x${string}`;
  borrowerWallet: `0x${string}`;
  lender: `0x${string}`;
  positionId: bigint;
  collateralAmount: bigint;
  loanAmount: bigint;
  rate: bigint;
  startTime: bigint;
  callTime: bigint;
  minimumDuration: bigint;
  offer: LoanOffer;
  market: any;
};

export type AllLoanData = {
  events: any[];
  offers: LoanOffer[];
  markets: Map<string, any>;
  loans: Loan[];
};
