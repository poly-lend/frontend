import markets from "@/data/markets.json";

export default async function fetchMarkets(
  tokenIds: string[]
): Promise<Map<string, any>> {
  const result = new Map<string, any>();
  markets.forEach((market) => {
    JSON.parse(market.clobTokenIds).forEach(
      (tokenId: string, index: number) => {
        const answers = JSON.parse(market.outcomes);
        const outcome = answers[index];
        result.set(tokenId, { market, outcome, outcomeIndex: index });
      }
    );
  });
  return result;
}
