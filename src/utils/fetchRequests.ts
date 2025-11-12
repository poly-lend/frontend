import { LoanRequest } from "@/types/polyLend";

export const fetchRequests = async (params: {
  publicClient: any;
  address?: `0x${string}`;
}): Promise<LoanRequest[]> => {
  const url = `https://api.polylend.com/requests`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch requests: ${response.statusText}`);
  }
  const requestsData = await response.json();
  let requests: LoanRequest[] = requestsData.map((request: any) => ({
    requestId: BigInt(request._id),
    borrower: request.borrower as `0x${string}`,
    borrowerWallet: request.borrowerWallet as `0x${string}`,
    positionId: BigInt(request.positionId),
    collateralAmount: BigInt(request.collateralAmount),
    minimumDuration: BigInt(request.minimumDuration),
  }));
  if (params.address) {
    requests = requests.filter(
      (request: any) =>
        request.borrower.toLowerCase() === params.address?.toLocaleLowerCase()
    );
  }

  return requests;
};
