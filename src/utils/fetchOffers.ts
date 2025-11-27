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
    ...offer,
    offerId: offer._id,
    positionIds: offer.positionIds.map((positionId: any) => positionId),
  }));
  if (params.address) {
    offers = offers.filter(
      (offer: LoanOffer) =>
        offer.lender.toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }

  return offers;
};
