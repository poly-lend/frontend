"use client";

import LoansTable from "@/components/loansTable";
import PositionSelect from "@/components/positionSelect";
import RequestsTable from "@/components/requestsTable";
import { polylendAddress, polymarketTokensAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import useProxyAddress from "@/hooks/useProxyAddress";
import { LoanRequest } from "@/types/polyLend";
import { Position } from "@/types/polymarketPosition";
import { fetchRequests } from "@/utils/fetchRequests";
import { execSafeTransaction } from "@/utils/proxy";
import { Button, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function Borrow() {
  const { address } = useAccount();
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const { data: proxyAddress } = useProxyAddress();
  const [selectedPosition, selectPosition] = useState<Position | null>(null);
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const [minimumDuration, setMinimumDuration] = useState(10);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

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

  return (
    <>
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
        if (proxyAddress){" "}
        {
          <PositionSelect
            address={proxyAddress!}
            selectedPosition={selectedPosition}
            selectPosition={selectPosition}
          />
        }
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
        {address && <RequestsTable address={address} />}
      </Stack>
      <LoansTable />
    </>
  );
}
