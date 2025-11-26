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
    offerId: BigInt(offer._id),
    lender: offer.lender as `0x${string}`,
    loanAmount: BigInt(offer.loanAmount),
    rate: BigInt(offer.rate),
    borrowedAmount: BigInt(offer.borrowedAmount),
    positionIds: offer.positionIds.map((positionId: any) => BigInt(positionId)),
    collateralAmount: BigInt(offer.collateralAmount),
    minimumLoanAmount: BigInt(offer.minimumLoanAmount),
    duration: BigInt(offer.duration),
    startTime: BigInt(offer.startTime),
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
