import markets from "@/data/markets.json";

export default async function fetchMarkets(
  tokenIds: string[]
): Promise<Map<string, any>> {
  const result = new Map<string, any>();
  markets.forEach((market) => {
    JSON.parse(market.clobTokenIds).forEach(
      (tokenId: string, index: number) => {
        const outcome = JSON.parse(market.outcomes)[index];
        const outcomePrice = JSON.parse(market.outcomePrices)[index];
        result.set(tokenId, {
          market,
          outcome,
          outcomePrice,
          outcomeIndex: index,
          event: market.events[0],
        });
      }
    );
  });
  return result;
}
