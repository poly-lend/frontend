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
        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        onClick={() => connect({ connector })}
      >
        Connect
      </Button>
    );
  });
}
