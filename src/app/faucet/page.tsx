"use client";

import { BalanceRefreshContext } from "@/app/context";
import { usdcDecimals } from "@/configs";
import { usdcConfig } from "@/contracts/usdc";
import { Input, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Faucet() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(1000);
  const { setBalanceRefresh } = useContext(BalanceRefreshContext);

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const mintUSDC = async () => {
    writeContract({
      address: usdcConfig.address,
      abi: usdcConfig.abi,
      functionName: "mint",
      args: [address as `0x${string}`, BigInt(amount * 10 ** usdcDecimals)],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      setBalanceRefresh(true);
    }
  }, [isConfirmed, setBalanceRefresh]);

  return (
    <Stack spacing={2}>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          paddingTop: 50,
          paddingBottom: 20,
          textAlign: "center",
        }}
      >
        Faucet
      </h1>
      <div>
        <Input
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Button
          variant="contained"
          onClick={() => mintUSDC()}
          disabled={isPending}
        >
          {isPending ? "Minting..." : "Mint pfUSDC"}
        </Button>
        {hash && (
          <div>
            Transaction Hash:{" "}
            <a
              style={{ color: "blue" }}
              href={`https://polygonscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hash}
            </a>
          </div>
        )}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    </Stack>
  );
}
