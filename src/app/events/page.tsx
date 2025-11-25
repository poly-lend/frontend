"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import fetchEvents from "@/utils/fetchEvents";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Offer() {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetchEvents().then(setData);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-center text-4xl mb-4">Offer</h1>
      <div className="flex gap-2">
        {data?.map((event) => (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img
                  width={40}
                  height={40}
                  src={event.icon}
                  alt={event.title}
                />
                <p className="text-lg font-bold">{event.title}</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-sm text-gray-500">Liquidity:</p>
                <p className="text-sm text-gray-500">
                  ${Number(event.liquidity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm flex-1 text-gray-500">Volume:</p>
                <p className="text-sm text-gray-500">
                  ${Number(event.volume).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm flex-1 text-gray-500">Markets:</p>
                <p className="text-sm text-gray-500">
                  {event.markets.filter((market: any) => market.active).length}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full" asChild>
                <Link href={`/event/${event.slug}`}>Check Market</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Card className="w-full max-w-sm">
          <CardContent className="flex items-center justify-center h-full">
            <h2 className="text-2xl font-bold">New Market Coming Soon</h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
