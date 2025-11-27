import { AllLoanData } from "@/types/polyLend";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LenderRequestsTable({
  title,
  data,
  userAddress,
  onDataRefresh,
}: {
  title?: string;
  data: AllLoanData;
  userAddress: string | undefined;
  onDataRefresh: () => void;
}) {
  // let requests = data.requests;
  // requests = requests.filter(
  //   (request: LoanRequest) => request.borrower !== userAddress
  // );

  const [expandedRequestIds, setExpandedRequestIds] = useState<Set<bigint>>(
    new Set()
  );
  const toggleExpanded = (requestId: bigint) => {
    setExpandedRequestIds((prev) => {
      const next = new Set(prev);
      if (next.has(requestId)) {
        next.delete(requestId);
      } else {
        next.add(requestId);
      }
      return next;
    });
  };

  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center">
        {title ? title : "All Borrow Requests"}
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">Borrower</TableHead>
            <TableHead className="text-center">Market</TableHead>
            <TableHead className="text-center"> Side </TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Collateral</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-right">Offers</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {requests.map((request) => {
                const isExpanded = expandedRequestIds.has(request.requestId);
                return (
                  <Fragment key={request.requestId.toString()}>
                    <TableRow>
                      <TableCell align="right">
                        <Address address={request.borrower} />
                      </TableCell>
                      <TableCell align="left" className="whitespace-normal">
                        <Market market={request.market} />
                      </TableCell>
                      <TableCell align="center">
                        <OutcomeBadge outcome={request.market.outcome} />
                      </TableCell>
                      <TableCell className="text-right">
                        {toSharesText(request.collateralAmount)}
                      </TableCell>
                      <TableCell align="right">
                        {toUSDCString(
                          Number(request.market.outcomePrice) *
                            Number(request.collateralAmount)
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {toDuration(Number(request.minimumDuration))}
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex justify-end items-center gap-1">
                          {request.offers.length > 0 && (
                            <Button
                              className="bg-transparent text-white hover:bg-gray-500/30 w-7 h-7 rounded-full"
                              onClick={() => toggleExpanded(request.requestId)}
                            >
                              {isExpanded ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                          )}
                          <span>{request.offers.length}</span>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <OfferDialog
                          requestId={request.requestId}
                          loanDuration={Number(request.minimumDuration)}
                          onDataRefresh={onDataRefresh}
                        />
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <RequestOffersNestedTable offers={request.offers} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })} */}
        </TableBody>
      </Table>
    </>
  );
}
