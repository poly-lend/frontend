import { LoanOffer } from "@/types/polyLend";

export const fetchOffers = async (params: {
  publicClient: any;
  address?: `0x${string}`;
}): Promise<LoanOffer[]> => {
  const url = `https://api.polylend.com/offers`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch offers: ${response.statusText}`);
  }
  const offersData = await response.json();

  let offers: LoanOffer[] = offersData.map((offer: any, index: number) => ({
    offerId: offer._id,
    lender: offer.lender as `0x${string}`,
    loanAmount: offer.loanAmount,
    rate: offer.rate,
    borrowedAmount: offer.borrowedAmount,
    positionIds: offer.positionIds.map((positionId: any) => positionId),
    collateralAmount: offer.collateralAmount,
    minimumLoanAmount: offer.minimumLoanAmount,
    duration: offer.duration,
    startTime: offer.startTime,
    perpetual: offer.perpetual,
  }));
  if (params.address) {
    offers = offers.filter(
      (offer: LoanOffer) =>
        offer.lender.toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }

  return offers;
};
