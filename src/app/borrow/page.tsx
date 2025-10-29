"use client";

import { polylendAddress, polymarketTokensAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import { proxyConfig } from "@/contracts/proxy";
import { Position } from "@/types/polymarketPosition";
import { fetchRequests } from "@/utils/fetchRequests";
import { execSafeTransaction } from "@/utils/proxy";
import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";

export default function Borrow() {
  const { address } = useAccount();
  const [requests, setRequests] = useState<
    [`0x${string}`, bigint, bigint, bigint][]
  >([]);
  const [selectedPosition, selectPosition] = useState<Position | null>(null);
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const [minimumDuration, setMinimumDuration] = useState(10);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { data: proxyAddress } = useReadContract({
    ...proxyConfig,
    functionName: "computeProxyAddress",
    args: [address as `0x${string}`],
  });

  useEffect(() => {
    if (!publicClient || !address) return;
    fetchRequests({ publicClient, address }).then(setRequests);
  }, [publicClient, address]);

  const requestLoan = async () => {
    if (!walletClient || !publicClient) return;
    walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "request",
      args: [
        proxyAddress as `0x${string}`,
        selectedPosition!.asset,
        BigInt(amount),
        BigInt(minimumDuration * 24 * 60 * 60),
      ],
    });
  };

  const giveApproval = async () => {
    if (!walletClient || !publicClient) return;
    await execSafeTransaction({
      safe: proxyAddress as `0x${string}`,
      tx: {
        to: polymarketTokensAddress as `0x${string}`,
        data: encodeFunctionData({
          abi: polymarketTokensConfig.abi,
          functionName: "setApprovalForAll",
          args: [polylendAddress as `0x${string}`, true],
        }),
      },
      walletClient,
      publicClient,
    });
  };

  const {
    data: positions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const r = await fetch(
        `https://data-api.polymarket.com/positions?user=${proxyAddress}`
      );
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json() as Promise<Position[]>;
    },
    staleTime: 60_000,
  });

  return (
    <Stack spacing={2}>
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
      <h2>Proxy Address: {proxyAddress}</h2>
      <h2>Positions: {positions?.length}</h2>
      <Select
        label="Select a position"
        style={{ width: "100%" }}
        value={selectedPosition?.asset}
        onChange={(e) => {
          const position =
            positions?.find((position) => position.asset === e.target.value) ||
            null;
          selectPosition(position);
          setAmount(BigInt(position!.size! * 10 ** 6 || 0));
        }}
      >
        {positions?.map((position) => (
          <MenuItem
            key={position.asset.toString()}
            value={position.asset.toString()}
          >
            <img
              src={position.icon}
              alt={position.title}
              width={50}
              height={50}
            />
            <h3>{position.title}</h3>
            <p>{position.currentValue.toFixed(2)}</p>
          </MenuItem>
        ))}
      </Select>

      <h2>Selected Position: {selectedPosition?.title}</h2>
      <h2>Selected Asset: {selectedPosition?.asset.toString()}</h2>
      <TextField
        type="number"
        label="Shares"
        placeholder="Shares"
        value={amount.toString()}
        onChange={(e) => setAmount(BigInt(e.target.value))}
      />

      <TextField
        type="number"
        label="Minimum Duration days"
        placeholder="Minimum Duration days"
        value={minimumDuration}
        onChange={(e) => setMinimumDuration(Number(e.target.value))}
      />
      <Button variant="contained" color="primary" onClick={giveApproval}>
        Give approval
      </Button>

      <Button variant="contained" color="primary" onClick={requestLoan}>
        Request a loan
      </Button>
      <h2>Requests: {requests.length}</h2>
      <ul>
        {requests.map((request, index) => (
          <li key={index}>{request[0]}</li>
        ))}
      </ul>
    </Stack>
  );
}
