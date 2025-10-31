import { proxyConfig } from "@/contracts/proxy";
import { useAccount, useReadContract } from "wagmi";

export default function useProxyAddress() {
  const { address } = useAccount();
  const proxyAddressData = useReadContract({
    ...proxyConfig,
    functionName: "computeProxyAddress",
    args: [address as `0x${string}`],
  });

  return proxyAddressData;
}
