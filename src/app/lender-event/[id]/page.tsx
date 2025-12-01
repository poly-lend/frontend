"use client";

import OfferDialog from "@/components/dialogs/offerDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Event, Market, MarketOutcome } from "@/types/polyLend";
import { fetchData } from "@/utils/fetchData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OfferDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [markets, setMarkets] = useState<Market[] | null>(null);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [marketOutcomes, setMarketOutcomes] = useState<
    Map<string, MarketOutcome>
  >(new Map());

  const handleSelectMarket = (marketOutcomeIds: string[]) => {
    setSelectedMarkets([...(selectedMarkets || []), ...marketOutcomeIds]);
  };

  const handleUnselectMarket = (marketOutcomeIds: string[]) => {
    setSelectedMarkets(
      selectedMarkets?.filter((m: string) => !marketOutcomeIds.includes(m))
    );
  };

  useEffect(() => {
    fetchData({}).then((data) => {
      const event = data.events.find((event: Event) => event.slug === id);
      if (!event) return;
      let markets = event?.markets.filter((market: Market) => market.active);
      markets = markets.sort(
        (a: Market, b: Market) =>
          Number(b.outcomePrices[0]) - Number(a.outcomePrices[0])
      );
      setEvent(event);
      setMarkets(markets);
      setMarketOutcomes(data.marketOutcomes);
    });
  }, []);

  return (
    <div>
      <h1 className="font-bold text-4xl mb-4 flex items-center gap-2">
        <Checkbox
          checked={selectedMarkets.length === markets?.length}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedMarkets(
                markets?.reduce(
                  (acc: string[], market: Market) => [
                    ...acc,
                    ...market.clobTokenIds,
                  ],
                  []
                ) || []
              );
            } else {
              setSelectedMarkets([]);
            }
          }}
        />
        <img width={40} height={40} src={event?.icon} alt={event?.title} />
        <span className="flex-1">{event?.title}</span>
        <OfferDialog
          marketOutcomeIds={selectedMarkets}
          marketOutcomes={marketOutcomes}
          onDataRefresh={() => {}}
        />
      </h1>
      <div className="flex flex-col gap-2">
        {markets?.map((market: Market) => (
          <div key={market.id} className="flex items-center gap-2">
            <Checkbox
              checked={selectedMarkets.includes(market.clobTokenIds[0])}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleSelectMarket(market.clobTokenIds);
                } else {
                  handleUnselectMarket(market.clobTokenIds);
                }
              }}
            />
            <img
              width={40}
              height={40}
              src={market.icon}
              alt={market.groupItemTitle}
            />
            <p className="font-bold flex-1 flex flex-col gap-2">
              {market.groupItemTitle}
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <span className="text-sm text-gray-500">Liquidity:</span>
                {Number(market.liquidityNum).toFixed(2)}
              </span>
            </p>
            <p className="text-lg">
              {Math.round(market.outcomePrices[0] * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
