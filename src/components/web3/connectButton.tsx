import { useConnect } from "wagmi";
import { Button } from "../ui/button";

export function ConnectButton() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => {
    if (connector.name !== "Injected") {
      return null;
    }
    return (
      <Button
        key={connector.uid}
        className="bg-amber-500 cursor-pointer hover:bg-amber-600"
        onClick={() => connect({ connector })}
      >
        Connect
      </Button>
    );
  });
}
