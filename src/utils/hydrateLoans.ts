import { Loan } from "@/types/polyLend";

export const hydrateLoans = (loans: Loan[], markets: Map<string, any>) => {
  return loans.map((loan) => {
    return {
      ...loan,
      market: markets.get(loan.positionId.toString()),
    };
  });
};
