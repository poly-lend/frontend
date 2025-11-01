import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";

import { LoanRequest } from "@/types/polyLend";
import { fetchOffers } from "./fetchOffers";
import { hydrateRequests } from "./hydrateRequests";

export const fetchRequestsWithOffers = async (params: {
  publicClient: any;
  address?: `0x${string}`;
}): Promise<LoanRequest[]> => {
  const requests = await fetchRequests(params);
  const offers = await fetchOffers({ publicClient: params.publicClient });
  return hydrateRequests(requests, offers);
};

export const fetchRequests = async (params: {
  publicClient: any;
  address?: `0x${string}`;
}): Promise<LoanRequest[]> => {
  const calls = [];
  for (var i = 0; i < 100; i++) {
    calls.push({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "requests",
      args: [i],
    });
  }
  const requestsData = await params.publicClient.multicall({
    contracts: calls,
  });

  let requests: LoanRequest[] = requestsData
    .map((request: any, index: number) => ({
      requestId: BigInt(index),
      borrower: request.result[0] as `0x${string}`,
      borrowerWallet: request.result[1],
      positionId: BigInt(request.result[2]),
      collateralAmount: BigInt(request.result[3]),
      minimumDuration: BigInt(request.result[4]),
      offers: [],
    }))

    .filter(
      (request: LoanRequest) =>
        request.borrower !== `0x0000000000000000000000000000000000000000`
    );
  if (params.address) {
    requests = requests.filter(
      (request: any) =>
        request.borrower.toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }
  console.log(requests);
  return requests;
};
