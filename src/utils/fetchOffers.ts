import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";

import { LoanOffer, LoanRequest } from "@/types/polyLend";

export const fetchOffers = async (params: {
  publicClient: any;
  address?: `0x${string}`;
}): Promise<LoanOffer[]> => {
  const calls = [];
  for (var i = 0; i < 100; i++) {
    calls.push({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "offers",
      args: [i],
    });
  }
  const offersData = await params.publicClient.multicall({
    contracts: calls,
  });

  let offers: LoanOffer[] = offersData
    .map((offer: any, index: number) => ({
      offerId: BigInt(index),
      requestId: BigInt(offer.result[0]),
      lender: offer.result[1] as `0x${string}`,
      loanAmount: BigInt(offer.result[2]),
      rate: BigInt(offer.result[3]),
    }))

    .filter(
      (request: LoanRequest) =>
        request.borrower !== `0x0000000000000000000000000000000000000000`
    );
  if (params.address) {
    offers = offers.filter(
      (request: any) =>
        request.borrower.toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }
  console.log(offers);
  return offers;
};
