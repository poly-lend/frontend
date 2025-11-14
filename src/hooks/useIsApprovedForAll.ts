import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

type Params = {
  tokenAddress: `0x${string}`;
  owner: `0x${string}` | undefined;
  operator: `0x${string}`;
  abi: any;
};

export default function useIsApprovedForAll(
  enabled: boolean,
  params: Params,
  extraDeps: any[] = []
) {
  const publicClient = usePublicClient();
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    const { owner, tokenAddress, operator, abi } = params;
    if (!enabled || !publicClient || !owner) {
      setIsApproved(false);
      return;
    }
    try {
      setIsLoading(true);
      const approved = (await publicClient.readContract({
        address: tokenAddress,
        abi,
        functionName: "isApprovedForAll",
        args: [owner, operator],
      })) as boolean;
      setIsApproved(Boolean(approved));
    } catch {
      setIsApproved(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    enabled,
    publicClient,
    params.tokenAddress,
    params.abi,
    params.operator,
    params.owner,
  ]);

  useEffect(() => {
    // Trigger read on mount or when deps change
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, ...extraDeps]);

  return { isApproved, isLoading, refresh };
}
