export type Market = {
  id: string;
  groupItemTitle: string;
  icon: string;
  question: string;
  clobTokenIds: string[];
  outcomes: string[];
  outcomePrices: number[];
  events: Event[];
  active: boolean;
  liquidityNum: string;
};

export type MarketOutcome = {
  market: Market;
  outcome: string;
  outcomePrice: number;
  outcomeIndex: number;
  event: any;
};

export type Event = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  markets: Market[];
};

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
  marketOutcome: MarketOutcome;
};

export type AllLoanData = {
  events: Event[];
  offers: LoanOffer[];
  marketOutcomes: Map<string, MarketOutcome>;
  loans: Loan[];
};
