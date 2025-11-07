import { AllLoanData } from "@/types/polyLend";
import { fetchLoans } from "./fetchLoans";
import fetchMarkets from "./fetchMarkets";
import { fetchOffers } from "./fetchOffers";
import { fetchRequests } from "./fetchRequests";
import { hydrateLoans } from "./hydrateLoans";
import { hydrateOffers } from "./hydrateOffers";
import { hydrateRequests } from "./hydrateRequests";

export const fetchData = async (params: {
  publicClient: any;
  borrower?: `0x${string}`;
  lender?: `0x${string}`;
}): Promise<AllLoanData> => {
  const requests = await fetchRequests({
    publicClient: params.publicClient,
    address: params.borrower,
  });
  const offers = await fetchOffers({
    publicClient: params.publicClient,
    address: params.lender,
  });

  const loans = await fetchLoans({
    publicClient: params.publicClient,
    borrower: params.borrower,
    lender: params.lender,
  });

  let positionIds = [
    ...new Set([
      ...requests.map((request) => request.positionId.toString()),
      ...loans.map((loan) => loan.positionId.toString()),
    ]),
  ];
  const markets = await fetchMarkets(positionIds);

  const hydratedRequests = hydrateRequests(requests, offers, markets);
  const hydratedOffers = hydrateOffers(offers, requests, markets).filter(
    (offer) => offer.request
  );

  const hydratedLoans = hydrateLoans(loans, markets);

  console.log(hydratedRequests);
  return {
    markets,
    requests: hydratedRequests,
    offers: hydratedOffers,
    loans: hydratedLoans,
  };
};
