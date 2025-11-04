import { polymarketSharesDecimals, usdcDecimals } from "@/configs";

export const toUSDCString = (amount: bigint | string | number) => {
  return (Number(amount) / 10 ** usdcDecimals).toFixed(2);
};

export const toDuration = (seconds: number | bigint | string) => {
  return `${Math.floor(Number(seconds) / 24 / 60 / 60)} Days`;
};

export const truncateAddress = (address: `0x${string}`) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const toSharesText = (amount: bigint | string) => {
  return (Number(amount) / 10 ** polymarketSharesDecimals).toFixed(
    polymarketSharesDecimals
  );
};
