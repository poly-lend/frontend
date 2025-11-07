import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";

import { LoanRequest } from "@/types/polyLend";

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
      requestId: BigInt(request.result[0]),
      borrower: request.result[1] as `0x${string}`,
      borrowerWallet: request.result[2],
      positionId: BigInt(request.result[3]),
      collateralAmount: BigInt(request.result[4]),
      minimumDuration: BigInt(request.result[5]),
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

  return requests;
};
