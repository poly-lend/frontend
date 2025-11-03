export default async function fetchMarkets(tokenIds: string[]) {
  const queryString = tokenIds
    .map((tokenId) => `clob_token_ids=${tokenId}`)
    .join("&");
  const response = await fetch(
    `https://gamma-api.polymarket.com/markets?${queryString}`
  );
  return await response.json();
}
