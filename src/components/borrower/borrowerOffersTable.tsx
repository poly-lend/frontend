import { AllLoanData } from "@/types/polyLend";
import { Fragment, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { polymarketSharesDecimals } from "@/config";
import useProxyAddress from "@/hooks/useProxyAddress";
import { Position } from "@/types/polymarketPosition";
import {
  toAPYText,
  toDuration,
  toSharesText,
  toUSDCString,
} from "@/utils/convertors";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import AcceptDialog from "../dialogs/acceptDialog";
import { Button } from "../ui/button";
import Address from "../widgets/address";
import Market from "../widgets/market";
import OutcomeBadge from "../widgets/outcomeBadge";

export default function BorrowerOffersTable({ data }: { data: AllLoanData }) {
  const router = useRouter();
  const { data: proxyAddress } = useProxyAddress();
  const [unsupportedPositions, setUnsupportedPositions] = useState(0);
  const { data: positions } = useQuery({
    queryKey: ["positions", proxyAddress],
    queryFn: async () => {
      if (!proxyAddress) return [];
      const r = await fetch(
        `https://data-api.polymarket.com/positions?user=${proxyAddress}`
      );
      if (!r.ok) throw new Error("HTTP " + r.status);
      const positions = (await r.json()) as Position[];
      const result: Position[] = [];
      let unsupported = 0;
      positions.forEach((position) => {
        if (!data.events.find((event) => event.slug === position.eventSlug)) {
          unsupported++;
          return;
        }
        position.marketOutcome = data.marketOutcomes.get(position.asset)!;
        position.offers = [];
        data.offers.forEach((offer) => {
          if (offer.positionIds.includes(position.asset)) {
            position.offers.push(offer);
          }
        });
        result.push(position);
      });

      setUnsupportedPositions(unsupported);
      return result;
    },
    staleTime: 60_000,
  });

  const [selectedPosition, selectPosition] = useState<Position | null>(null);

  return (
    <>
      {positions && positions?.length === 0 && (
        <div className="text-center">No positions found</div>
      )}
      {positions && positions?.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Market</TableHead>
              <TableHead className="text-center">Side</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Offers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions?.map((position: Position) => (
              <Fragment key={position.asset.toString()}>
                <TableRow>
                  <TableCell align="center" className="whitespace-normal">
                    <Market
                      marketOutcome={position.marketOutcome}
                      eventSlug={position.eventSlug}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <OutcomeBadge outcome={position.marketOutcome.outcome} />
                  </TableCell>
                  <TableCell align="right">
                    {toSharesText(
                      position.size * 10 ** polymarketSharesDecimals
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {toUSDCString(
                      Number(position.size) *
                        Number(position.curPrice) *
                        10 ** polymarketSharesDecimals
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {position.offers?.length ?? 0}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        disabled={position.offers.length === 0}
                        variant="outline"
                        onClick={() => {
                          if (
                            selectedPosition &&
                            selectedPosition.asset === position.asset
                          ) {
                            selectPosition(null);
                          } else {
                            selectPosition(position);
                          }
                        }}
                      >
                        Offers
                        {selectedPosition?.asset === position.asset ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {selectedPosition &&
                  selectedPosition.asset === position.asset && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <Table>
                          <TableHeader className="border-b">
                            <TableRow>
                              <TableHead className="text-right">
                                Lender
                              </TableHead>
                              <TableHead className="text-right">
                                Amount
                              </TableHead>
                              <TableHead className="text-right">
                                Minimum Amount
                              </TableHead>
                              <TableHead className="text-right">
                                Duration
                              </TableHead>
                              <TableHead className="text-right">Rate</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {position.offers.map((offer) => (
                              <TableRow key={offer.offerId}>
                                <TableCell align="right">
                                  <Address address={offer.lender} />
                                </TableCell>
                                <TableCell align="right">
                                  {toUSDCString(offer.loanAmount)}
                                </TableCell>
                                <TableCell align="right">
                                  {toUSDCString(offer.minimumLoanAmount)}
                                </TableCell>
                                <TableCell align="right">
                                  {toDuration(offer.duration)}
                                </TableCell>
                                <TableCell align="right">
                                  {toAPYText(offer.rate)}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  className="flex justify-end"
                                >
                                  <AcceptDialog
                                    offer={offer}
                                    position={position}
                                    onSuccess={async () => {
                                      router.push("/borrower-loans");
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
              </Fragment>
            ))}
            {unsupportedPositions > 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  You have {unsupportedPositions}
                  {unsupportedPositions === 1
                    ? " more position "
                    : " more positions "}
                  that has no lenders yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
