import { chain } from "@/utils/wagmi";
import { Button } from "../ui/button";

import { useAccount, useSwitchChain } from "wagmi";

export default function ConnectChain() {
  const { address, chain: currentChain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isPolygon = currentChain?.id === chain.id;

  return address && !isPolygon ? (
    <div className="mr-4">
      <Button
        variant="outline"
        className="text-destructive hover:bg-destructive/20 hover:text-destructive"
        onClick={() => switchChain({ chainId: chain.id })}
      >
        Switch Chain
      </Button>
    </div>
  ) : (
    <></>
  );
}
