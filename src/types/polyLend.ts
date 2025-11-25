export type LoanRequest = {
  requestId: bigint;
  borrower: `0x${string}`;
  borrowerWallet: `0x${string}`;
  positionId: bigint;
  collateralAmount: bigint;
  minimumDuration: bigint;
  offers: LoanOffer[];
  market: any;
};

export type LoanOffer = {
  offerId: bigint;
  requestId: bigint;
  lender: `0x${string}`;
  loanAmount: bigint;
  rate: bigint;
  market: any;
  request?: LoanRequest;
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
  request: LoanRequest;
  offer: LoanOffer;
  market: any;
};

export type AllLoanData = {
  events: any[];
  requests: LoanRequest[];
  offers: LoanOffer[];
  markets: Map<string, any>;
  loans: Loan[];
};
