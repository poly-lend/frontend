"use client";

import { usdcDecimals } from "@/configs";
import { usdcConfig } from "@/contracts/usdc";
import { useState } from "react";
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Faucet() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(1000);

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

  return (
    <div>
      <h1>Faucet</h1>
      <div style={{ padding: "50px" }}></div>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={() => mintUSDC()} disabled={isPending}>
        {isPending ? "Minting..." : "Mint USDC"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
}
