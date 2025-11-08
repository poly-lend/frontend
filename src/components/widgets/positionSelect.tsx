import { Position } from "@/types/polymarketPosition";
import { MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export default function PositionSelect({
  address,
  selectedPosition,
  selectPosition,
}: {
  address: string;
  selectedPosition: Position | null;
  selectPosition: (position: Position | null) => void;
}) {
  const {
    data: positions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const r = await fetch(
        `https://data-api.polymarket.com/positions?user=${address}`
      );
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json() as Promise<Position[]>;
    },
    staleTime: 60_000,
  });
  return (
    <Select
      label="Select a position"
      style={{ width: "100%" }}
      value={selectedPosition ? selectedPosition.asset.toString() : ""}
      onChange={(e) => {
        const selectedAsset = String(e.target.value);
        const position =
          positions?.find(
            (position) => position.asset.toString() === selectedAsset
          ) ?? null;
        selectPosition(position);
      }}
    >
      <MenuItem value="" disabled>
        Select a position
      </MenuItem>
      {positions?.map((position) => (
        <MenuItem
          key={position.asset.toString()}
          value={position.asset.toString()}
        >
          <img
            src={position.icon}
            alt={position.title}
            width={50}
            height={50}
          />
          <h3>{position.title}</h3>
          <p>{position.currentValue.toFixed(2)}</p>
        </MenuItem>
      ))}
    </Select>
  );
}
