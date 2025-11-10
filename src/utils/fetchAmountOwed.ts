import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";

export const fetchAmountOwed = async (params: {
  publicClient: any;
  loanId: bigint;
  timestamp: bigint;
}): Promise<bigint> => {
  const owed = (await params.publicClient.readContract({
    address: polylendAddress as `0x${string}`,
    abi: polylendConfig.abi,
    functionName: "getAmountOwed",
    args: [params.loanId, params.timestamp],
  })) as bigint;
  return owed;
};
