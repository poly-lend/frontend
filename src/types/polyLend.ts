export type LoanOffer = {
  offerId: string;
  lender: `0x${string}`;
  loanAmount: string;
  rate: string;
  positionIds: string[];
  collateralAmounts: string[];
  minimumLoanAmount: string;
  duration: string;
  startTime: string;
  borrowedAmount: string;
  perpetual: boolean;
};

export type Loan = {
  loanId: string;
  borrower: `0x${string}`;
  borrowerWallet: `0x${string}`;
  lender: `0x${string}`;
  positionId: string;
  collateralAmount: string;
  loanAmount: string;
  rate: string;
  startTime: string;
  callTime: string;
  minimumDuration: string;
  offer: LoanOffer;
  market: any;
};

export type AllLoanData = {
  events: any[];
  offers: LoanOffer[];
  markets: Map<string, any>;
  loans: Loan[];
};
