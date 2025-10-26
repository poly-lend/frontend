"use client";

import { Button } from "@mui/material";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Faucet() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(1000);

  const mintUSDC = async () => {
    alert(address ?? "No address");
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
      <Button onClick={() => mintUSDC()}>Mint USDC</Button>
    </div>
  );
}
