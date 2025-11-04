import { usdcDecimals } from "@/configs";

export const convertToUSDCString = (amount: bigint) => {
  return (Number(amount) / 10 ** usdcDecimals).toFixed(2);
};
