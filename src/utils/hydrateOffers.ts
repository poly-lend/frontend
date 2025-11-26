import { LoanOffer } from "@/types/polyLend";

export const hydrateOffers = (
  offers: LoanOffer[],
  markets: Map<string, any>
): LoanOffer[] => {
  return offers.map((offer) => {
    return {
      ...offer,
      market: markets.get(offer.positionIds[0].toString()),
    };
  });
};
