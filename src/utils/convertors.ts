import { parseEther } from "viem";
import { polymarketSharesDecimals, usdcDecimals } from "../configs";

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
const ETHER = parseEther("1");

export const toUSDCString = (amount: bigint | string | number) => {
  return (Number(amount) / 10 ** usdcDecimals).toFixed(2) + " USDC";
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

export const toSPYWAI = (apy: number): bigint => {
  const rate = 1 + apy;
  console.log(rate);
  const value = rate ** (1 / SECONDS_PER_YEAR);
  console.log(value);
  return parseEther(value.toString());
};

export const toAPY = (spy: bigint | string) => {
  let value = BigInt(spy);

  return (Number(value) / Number(ETHER)) ** SECONDS_PER_YEAR - 1;
};

export const toAPYText = (spy: bigint | string) => {
  return (toAPY(spy) * 100).toFixed(2) + "%";
};
