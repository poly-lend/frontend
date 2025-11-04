import { LoanOffer, LoanRequest } from "@/types/polyLend";

export const hydrateRequests = (
  requests: LoanRequest[],
  offers: LoanOffer[],
  markets: Map<string, any>
) => {
  console.log(markets);
  return requests.map((request) => {
    return {
      ...request,
      offers: offers.filter((offer) => offer.requestId === request.requestId),
      market: markets.get(request.positionId.toString()),
    };
  });
};
