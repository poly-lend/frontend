import { polylendAddress, polymarketTokensAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { polymarketTokensConfig } from "@/contracts/polymarketTokens";
import useProxyAddress from "@/hooks/useProxyAddress";
import { Position } from "@/types/polymarketPosition";
import { execSafeTransaction } from "@/utils/proxy";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import PositionSelect from "../widgets/positionSelect";

export default function RequestDialog() {
  const { data: proxyAddress } = useProxyAddress();
  const [selectedPosition, selectPosition] = useState<Position | null>(null);
  const [shares, setShares] = useState(0.0);
  const [value, setValue] = useState(0.0);
  const [minimumDuration, setMinimumDuration] = useState(10);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const requestLoan = async () => {
    if (!walletClient || !publicClient) return;
    walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "request",
      args: [
        proxyAddress as `0x${string}`,
        selectedPosition!.asset,
        BigInt(shares * 10 ** 6),
        BigInt(minimumDuration * 24 * 60 * 60),
      ],
    });
  };

  useEffect(() => {
    if (!selectedPosition) return;
    setShares(selectedPosition.totalBought);
  }, [selectedPosition]);

  useEffect(() => {
    if (!selectedPosition) return;
    setValue(shares * selectedPosition.curPrice);
  }, [shares]);

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
      {proxyAddress && (
        <PositionSelect
          address={proxyAddress!}
          selectedPosition={selectedPosition}
          selectPosition={selectPosition}
        />
      )}

      <h2>Selected Position: {selectedPosition?.title}</h2>
      <TextField
        type="number"
        label="Shares"
        placeholder="Shares"
        value={shares}
        onChange={(e) => {
          const maxShares = selectedPosition?.totalBought ?? 0;
          const currentShares = Number(e.target.value);
          if (currentShares > maxShares) {
            setShares(maxShares);
          } else {
            setShares(currentShares);
          }
          if (currentShares < 0) {
            setShares(0.0);
          }
        }}
      />
      <TextField
        type="number"
        label="Value"
        placeholder="Value"
        value={value.toFixed(2)}
        disabled
      />
      <TextField
        type="number"
        label="Minimum Duration Days"
        placeholder="Minimum Duration Days"
        value={minimumDuration}
        onChange={(e) => setMinimumDuration(Number(e.target.value))}
      />
      <Button variant="contained" color="primary" onClick={giveApproval}>
        Give approval
      </Button>
      <Button variant="contained" color="primary" onClick={requestLoan}>
        Request a loan
      </Button>
    </>
  );
}
