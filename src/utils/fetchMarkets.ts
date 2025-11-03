export default async function fetchMarkets() {
  const response = await fetch(
    "https://gamma-api.polymarket.com/markets?limit=1000&active=true&closed=false"
  );
  const data = await response.json();
  return data;
}
