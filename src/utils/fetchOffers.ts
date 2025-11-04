import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";

import { LoanOffer } from "@/types/polyLend";
import fetchMarkets from "./fetchMarkets";
import { fetchRequests } from "./fetchRequests";
import { hydrateOffers } from "./hydrateOffers";

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
      (offer: LoanOffer) =>
        offer.lender !== `0x0000000000000000000000000000000000000000`
    );
  if (params.address) {
    offers = offers.filter(
      (offer: LoanOffer) =>
        offer.lender.toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }
  const requests = await fetchRequests({ publicClient: params.publicClient });
  const requestsMap = new Map(
    requests.map((request) => [request.requestId.toString(), request])
  );
  const markets = await fetchMarkets(
    requests.map((request) => request.positionId.toString())
  );

  return hydrateOffers(offers, requestsMap, markets);
};
