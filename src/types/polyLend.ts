export type LoanRequest = {
  requestId: bigint;
  borrower: `0x${string}`;
  borrowerWallet: `0x${string}`;
  positionId: bigint;
  collateralAmount: bigint;
  minimumDuration: bigint;
  offers: LoanOffer[];
};

export type LoanOffer = {
  offerId: bigint;
  requestId: bigint;
  lender: `0x${string}`;
  loanAmount: bigint;
  rate: bigint;
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
  minimumDuration: bigint;
};
