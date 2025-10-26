import { usdcDecimals } from "@/configs";
import { usdcConfig } from "@/contracts/usdc";
import { useAccount, useReadContract } from "wagmi";

export default function Balance() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    ...usdcConfig,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  return (
    address && (
      <div style={{ fontSize: 16, fontWeight: 600 }}>
        {balance ? Number(balance) / 10 ** usdcDecimals : 0} USDC
      </div>
    )
  );
}
