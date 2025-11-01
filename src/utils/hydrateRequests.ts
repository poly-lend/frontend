import { LoanOffer, LoanRequest } from "@/types/polyLend";

export const hydrateRequests = (
  requests: LoanRequest[],
  offers: LoanOffer[]
) => {
  return requests.map((request) => {
    return {
      ...request,
      offers: offers.filter((offer) => offer.requestId === request.requestId),
    };
  });
};
