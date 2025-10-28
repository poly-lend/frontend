"use client";

import { proxyConfig } from "@/contracts/proxy";
import { execSafeTransaction } from "@/utils/proxy";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";

export default function Borrow() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { data: proxyAddress } = useReadContract({
    ...proxyConfig,
    functionName: "computeProxyAddress",
    args: [address as `0x${string}`],
  });
  type Position = {
    proxyWallet: `0x${string}`;
    asset: `0x${string}`;
    conditionId: `0x${string}`;
    size: number;
    avgPrice: number;
    initialValue: number;
    currentValue: number;
    cashPnl: number;
    percentPnl: number;
    totalBought: number;
    realizedPnl: number;
    percentRealizedPnl: number;
    title: string;
    slug: string;
    icon: string;
    eventId: string;
    eventSlug: string;
    outcome: string;
    outcomeIndex: number;
    oppositeOutcome: string;
    oppositeAsset: `0x${string}`;
    endDate: string;
    negativeRisk: boolean;
  };
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );

  const requestLoan = async () => {
    if (!walletClient || !publicClient) return;
    await execSafeTransaction({
      safe: proxyAddress as `0x${string}`,
      tx: {
        to: proxyAddress as `0x${string}`,
        data: "0x",
        value: BigInt(1),
        operation: 0,
        safeTxGas: BigInt(0),
        baseGas: BigInt(0),
        gasPrice: BigInt(0),
        gasToken: "0x0000000000000000000000000000000000000000",
        refundReceiver: "0x0000000000000000000000000000000000000000",
      },
      walletClient,
      publicClient,
    });
  };

  const fetchPositions = async (proxyAddress: `0x${string}`) => {
    const response = await fetch(
      `https://data-api.polymarket.com/positions?user=${proxyAddress}`
    );
    const positions = await response.json();
    setPositions(positions);
    setSelectedPosition(positions[0]);
  };

  useEffect(() => {
    if (!proxyAddress) return;
    const loadPositions = async () => {
      await fetchPositions(proxyAddress as `0x${string}`);
    };
    loadPositions();
  }, [proxyAddress]);

  return (
    <>
      <div className="flex pitems-center justify-center">
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            paddingTop: 50,
            paddingBottom: 50,
          }}
        >
          Borrow
        </h1>
      </div>

      <h2>Proxy Address: {proxyAddress}</h2>
      <h2>Positions: {positions.length}</h2>
      {positions.map((position) => (
        <div key={position.conditionId}>
          <img
            src={position.icon}
            alt={position.title}
            width={100}
            height={100}
          />
          <h3>{position.title}</h3>

          <p>{position.currentValue}</p>
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={requestLoan}>
        Request a loan
      </Button>
    </>
  );
}
