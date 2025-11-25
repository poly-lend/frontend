export default async function fetchMarkets(): Promise<any[]> {
  const url = `https://api.polylend.com/events`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch markets: ${response.statusText}`);
  }
  const events = await response.json();
  return events;
}
