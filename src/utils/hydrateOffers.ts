import { LoanOffer, LoanRequest } from "@/types/polyLend";

export const hydrateOffers = (
  offers: LoanOffer[],
  requests: LoanRequest[],
  markets: Map<string, any>
): LoanOffer[] => {
  return offers.map((offer) => {
    const request = requests.find(
      (request) => request.requestId === offer.requestId
    );
    const market = request
      ? markets.get(request.positionId.toString())
      : undefined;
    return { ...offer, request, market };
  });
};
