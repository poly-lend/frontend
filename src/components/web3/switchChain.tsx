import { chain } from "@/utils/wagmi";

import { Button } from "@mui/material";
import { useAccount, useSwitchChain } from "wagmi";

export default function ConnectChain() {
  const { address, chain: currentChain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isPolygon = currentChain?.id === chain.id;

  return address && !isPolygon ? (
    <div className="mr-4">
      <Button
        color="error"
        variant="outlined"
        onClick={() => switchChain({ chainId: chain.id })}
      >
        Switch Chain
      </Button>
    </div>
  ) : (
    <></>
  );
}
