import { usdcDecimals } from "@/configs";

export const convertToUSDCString = (amount: bigint) => {
  return (Number(amount) / 10 ** usdcDecimals).toFixed(2);
};

export const SecondsToDays = (seconds: number) => {
  return seconds / 24 / 60 / 60;
};

export const truncateAddress = (address: `0x${string}`) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};
