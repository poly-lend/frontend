import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";

export const fetchRequests = async (params: {
  publicClient: any;
  address?: `0x${string}`;
}): Promise<[`0x${string}`, bigint, bigint, bigint][]> => {
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
  let requests = requestsData
    .filter((request: any) => request.status === "success")

    .map(
      (request: any) =>
        request.result as unknown as [`0x${string}`, bigint, bigint, bigint]
    )
    .filter(
      (request: any) =>
        request[0] !== `0x0000000000000000000000000000000000000000`
    );
  if (params.address) {
    requests = requests.filter(
      (request: any) =>
        request[0].toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }
  return requests;
};
