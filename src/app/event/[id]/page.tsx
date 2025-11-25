"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import fetchEvents from "@/utils/fetchEvents";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OfferDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<any | null>(null);
  const [markets, setMarkets] = useState<any[] | null>(null);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);

  const handleSelectMarket = (market: any) => {
    setSelectedMarkets([...(selectedMarkets || []), market]);
  };

  const handleUnselectMarket = (market: string) => {
    setSelectedMarkets(selectedMarkets?.filter((m: string) => m !== market));
  };

  const handleSendOffer = () => {
    const markets = selectedMarkets.reduce((acc: any, market: string) => {
      acc.push(...JSON.parse(market));
      return acc;
    }, []);
    console.log(markets);
  };

  useEffect(() => {
    fetchEvents().then((events) => {
      const event = events.find((event: any) => event.slug === id);
      let markets = event?.markets.filter((market: any) => market.active);
      markets = markets.sort(
        (a: any, b: any) =>
          Number(JSON.parse(b.outcomePrices)[0]) -
          Number(JSON.parse(a.outcomePrices)[0])
      );
      setEvent(event);
      setMarkets(markets);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Button disabled={selectedMarkets.length === 0} onClick={handleSendOffer}>
        Send Offer
      </Button>

      <h1 className="font-bold text-center text-4xl mb-4 flex items-center gap-2">
        <Checkbox
          checked={selectedMarkets.length === markets?.length}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedMarkets(
                markets?.map((market) => market.clobTokenIds) || []
              );
            } else {
              setSelectedMarkets([]);
            }
          }}
        />
        <img width={40} height={40} src={event?.icon} alt={event?.title} />
        <span className="flex-1">{event?.title}</span>
      </h1>
      <div className="flex flex-col gap-2">
        {markets?.map((market) => (
          <div key={market.id} className="flex items-center gap-2">
            <Checkbox
              checked={selectedMarkets.includes(market.clobTokenIds)}
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
              {Math.round(Number(JSON.parse(market.outcomePrices)[0]) * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
