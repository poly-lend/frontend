import { AllLoanData } from "@/types/polyLend";
import fetchEvents from "./fetchEvents";
import { fetchLoans } from "./fetchLoans";
import fetchMarkets from "./fetchMarkets";
import { fetchOffers } from "./fetchOffers";
import { hydrateLoans } from "./hydrateLoans";
import { hydrateOffers } from "./hydrateOffers";

export const fetchData = async (params: {
  publicClient: any;
  borrower?: `0x${string}`;
  lender?: `0x${string}`;
}): Promise<AllLoanData> => {
  const [offers, loans, events] = await Promise.all([
    fetchOffers({
      publicClient: params.publicClient,
      address: params.lender,
    }),
    fetchLoans({
      publicClient: params.publicClient,
      borrower: params.borrower,
      lender: params.lender,
    }),
    fetchEvents(),
  ]);

  let positionIds = loans.map((loan) => loan.positionId.toString());
  offers.forEach((offer) => {
    offer.positionIds.forEach((positionId) => {
      positionIds.push(positionId.toString());
    });
  });

  const markets = await fetchMarkets(positionIds);
  const hydratedOffers = hydrateOffers(offers, markets);
  const hydratedLoans = hydrateLoans(loans, markets);
  const data = {
    markets,
    offers: hydratedOffers,
    loans: hydratedLoans,
    events,
  };
  console.log(data);
  return data;
};
