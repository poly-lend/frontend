import { polylendAddress } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { AllLoanData } from "@/types/polyLend";
import { Fragment, useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useProxyAddress from "@/hooks/useProxyAddress";
import { Position } from "@/types/polymarketPosition";
import { toAPYText, toUSDCString } from "@/utils/convertors";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Address from "../widgets/address";
import LoadingActionButton from "../widgets/loadingActionButton";
import Market from "../widgets/market";
import OutcomeBadge from "../widgets/outcomeBadge";

export default function BorrowerOffersTable({
  data,
  onDataRefresh,
}: {
  address?: `0x${string}`;
  data: AllLoanData;
  onDataRefresh: () => void;
}) {
  const { data: proxyAddress } = useProxyAddress();
  const { data: positions, isLoading } = useQuery({
    queryKey: ["positions", proxyAddress],
    queryFn: async () => {
      if (!proxyAddress) return [];
      const r = await fetch(
        `https://data-api.polymarket.com/positions?user=${proxyAddress}`
      );
      if (!r.ok) throw new Error("HTTP " + r.status);
      const result = (await r.json()) as Position[];
      result.forEach((position) => {
        position.market = data.markets.get(position.asset.toString());
        position.offers = [];
        data.offers.forEach((offer) => {
          if (offer.positionIds.includes(position.asset)) {
            position.offers.push(offer);
          }
        });
      });
      console.log(result);
      return result;
    },
    staleTime: 60_000,
  });

  const [selectedPosition, selectPosition] = useState<Position | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [acceptingOfferId, setAcceptingOfferId] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptTxHash, setAcceptTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const { isLoading: isAcceptConfirming, isSuccess: isAcceptConfirmed } =
    useWaitForTransactionReceipt({
      hash: acceptTxHash,
    });

  const acceptOffer = async (offerId: string, positionId: string) => {
    if (!publicClient || !walletClient) return;
    try {
      setAcceptingOfferId(offerId);
      setIsAccepting(true);
      const hash = await walletClient.writeContract({
        address: polylendAddress as `0x${string}`,
        abi: polylendConfig.abi,
        functionName: "accept",
        args: [BigInt(offerId), BigInt(0), BigInt(0), BigInt(positionId), true],
      });
      setAcceptTxHash(hash);
    } catch (err) {
      const message =
        (err as BaseError)?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed";
      toast.error(message);
      setAcceptingOfferId(null);
    } finally {
      setIsAccepting(false);
    }
  };

  useEffect(() => {
    if (isAcceptConfirmed) {
      toast.success("Offer accepted successfully");
      selectPosition(null);
      setAcceptingOfferId(null);
      setAcceptTxHash(undefined);
      onDataRefresh();
    }
  }, [isAcceptConfirmed]);
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
              <TableHead className="text-right">Collateral</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Offers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions?.map((position) => (
              <Fragment key={position.asset.toString()}>
                <TableRow>
                  <TableCell align="center" className="whitespace-normal">
                    <Market market={position.market} />
                  </TableCell>
                  <TableCell align="center">
                    <OutcomeBadge outcome={position.market.outcome} />
                  </TableCell>
                  <TableCell align="right">
                    {/* {toSharesText(request.collateralAmount)} */}
                  </TableCell>
                  <TableCell align="right">
                    {/* {toUSDCString(
                      Number(request.market.outcomePrice) *
                        Number(request.collateralAmount)
                    )} */}
                  </TableCell>
                  <TableCell align="right">
                    {/* {toDuration(request.minimumDuration)} */}
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
                                  {toAPYText(offer.rate)}
                                </TableCell>
                                <TableCell align="right">
                                  <LoadingActionButton
                                    variant="outline-primary"
                                    onClick={() =>
                                      acceptOffer(offer.offerId, position.asset)
                                    }
                                    loading={
                                      acceptingOfferId === offer.offerId &&
                                      (isAccepting || isAcceptConfirming)
                                    }
                                  >
                                    Accept
                                  </LoadingActionButton>
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
          </TableBody>
        </Table>
      )}
    </>
  );
}
