"use client";

import { Button } from "@mui/material";
import { useAccount } from "wagmi";

export default function Faucet() {
  const { address } = useAccount();

  const mintUSDC = async () => {
    alert(address ?? "No address");
  };

  return (
    <div>
      <h1>Faucet</h1>
      <div style={{ padding: "50px" }}></div>
      <Button onClick={() => mintUSDC()}>Mint USDC</Button>
    </div>
  );
}
