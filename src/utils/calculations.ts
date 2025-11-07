const WAD = 1e18;

export const calculateAmountOwed = (
  loanAmount: bigint | number | string,
  rate: bigint | number | string,
  startTime: number
) => {
  const principal = Number(loanAmount);
  const growthPerSecond = Number(rate) / WAD;

  const now = Math.floor(Date.now() / 1000);
  const durationSeconds = Math.max(0, now - startTime);

  const multiplier = Math.pow(growthPerSecond, durationSeconds);

  return Math.floor(principal * multiplier);
};
