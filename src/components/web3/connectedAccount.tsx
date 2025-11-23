import { truncateAddress } from "@/utils/convertors";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function ConnectedAccount() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div className="flex items-center gap-2">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div>
          {ensName
            ? `${ensName} (${truncateAddress(address as `0x${string}`)})`
            : truncateAddress(address as `0x${string}`)}
        </div>
      )}

      <Button
        variant="default"
        onClick={() => disconnect()}
        className="cursor-pointer"
      >
        <LogOut className="size-5 stroke-[2.5px]" />
      </Button>
    </div>
  );
}
