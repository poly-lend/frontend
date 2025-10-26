import { usdcDecimals } from "@/configs";
import { usdcConfig } from "@/contracts/usdc";
import { useContext, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { BalanceRefreshContext } from "./context";

export default function Balance() {
  const { address } = useAccount();
  const { balanceRefresh, setBalanceRefresh } = useContext(
    BalanceRefreshContext
  );

  const { data: balance, refetch } = useReadContract({
    ...usdcConfig,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  useEffect(() => {
    refetch();
    setBalanceRefresh(false);
  }, [balanceRefresh, refetch, setBalanceRefresh]);

  return (
    address && (
      <div style={{ fontSize: 16, fontWeight: 600 }}>
        {balance ? Number(balance) / 10 ** usdcDecimals : 0} pfUSDC
      </div>
    )
  );
}
