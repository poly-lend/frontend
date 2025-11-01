import { polylendAddress, polylendDecimals, usdcDecimals } from "@/configs";
import { polylendConfig } from "@/contracts/polylend";
import { LoanRequest } from "@/types/polyLend";
import { fetchRequestsWithOffers } from "@/utils/fetchRequests";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

export default function RequestsTable({
  address,
}: {
  address?: `0x${string}`;
}) {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [selectedRequest, selectRequest] = useState<LoanRequest | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  useEffect(() => {
    if (!publicClient) return;
    fetchRequestsWithOffers({ publicClient, address }).then(setRequests);
  }, [publicClient, address]);

  const acceptOffer = async (offerId: bigint) => {
    if (!publicClient || !walletClient) return;
    await walletClient.writeContract({
      address: polylendAddress as `0x${string}`,
      abi: polylendConfig.abi,
      functionName: "accept",
      args: [offerId],
    });
  };
  return (
    <>
      <h2 className="text-2xl font-bold w-full text-center mt-8">Requests</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-center">Request ID</th>
            <th className="text-center">Borrower</th>
            <th className="text-center">Collateral Amount</th>
            <th className="text-center">Minimum Duration</th>
            <th className="text-center">Offers</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <>
              <tr key={request.requestId.toString()}>
                <td className="text-center">{request.requestId.toString()}</td>
                <td className="text-center">{request.borrower}</td>
                <td className="text-right">
                  {request.collateralAmount.toString()}
                </td>
                <td className="text-right">
                  {request.minimumDuration.toString()}
                </td>
                <td className="text-right">
                  {request.offers.length.toString()}
                </td>
                <td className="text-right">
                  <Button
                    disabled={request.offers.length === 0}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      if (
                        selectedRequest &&
                        selectedRequest.requestId === request.requestId
                      ) {
                        selectRequest(null);
                      } else {
                        selectRequest(request);
                      }
                    }}
                  >
                    Offers
                  </Button>
                </td>
              </tr>
              {selectedRequest &&
                selectedRequest.requestId === request.requestId && (
                  <tr>
                    <td colSpan={6}>
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th>Offer ID</th>
                            <th>Lender</th>
                            <th>Loan Amount</th>
                            <th>Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {request.offers.map((offer) => (
                            <tr key={offer.offerId.toString()}>
                              <td className="text-center">
                                {offer.offerId.toString()}
                              </td>
                              <td>{offer.lender}</td>
                              <td className="text-right">
                                {formatUnits(offer.loanAmount, usdcDecimals)}{" "}
                                USDC
                              </td>
                              <td className="text-right">
                                {(
                                  offer.rate - BigInt(10 ** polylendDecimals)
                                ).toString()}
                                %
                              </td>
                              <td className="text-right">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => acceptOffer(offer.offerId)}
                                >
                                  Accept
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
            </>
          ))}
        </tbody>
      </table>
    </>
  );
}
