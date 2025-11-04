import { LoanOffer, LoanRequest } from "@/types/polyLend";

export const hydrateOffers = (
  offers: LoanOffer[],
  requests: Map<string, LoanRequest>,
  markets: Map<string, any>
) => {
  return offers.map((offer) => {
    const request = requests.get(offer.requestId.toString());
    const market = request ? markets.get(request.positionId.toString()) : null;
    return { ...offer, request, market };
  });
};
