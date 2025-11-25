"use client";

import { useParams } from "next/navigation";

export default function OfferDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="font-bold text-center text-4xl mb-4">Offer Details</h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-center text-2xl mb-4">Offer Details</h2>
          <p className="text-center text-sm text-gray-500">{id}</p>
        </div>
      </div>
    </div>
  );
}
