export default async function fetchMarkets(
  tokenIds: string[]
): Promise<Map<string, any>> {
  const params = tokenIds
    .map((tokenId) => `clob_token_ids=${tokenId}`)
    .join("&");
  const url = `https://api.polylend.com/markets?${params}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch markets: ${response.statusText}`);
  }
  const markets = await response.json();
  const result = new Map<string, any>();
  markets.forEach((market: any) => {
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
