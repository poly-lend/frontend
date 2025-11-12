import { Position } from "@/types/polymarketPosition";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export default function PositionSelect({
  address,
  selectedPosition,
  onPositionSelect,
}: {
  address: string;
  selectedPosition: Position | null;
  onPositionSelect: (position: Position | null) => void;
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
    <FormControl fullWidth>
      <InputLabel id="position-select-label">Select Position</InputLabel>
      <Select
        labelId="position-select-label"
        variant="outlined"
        label="Select Position"
        value={selectedPosition?.asset.toString() ?? ""}
        onChange={(e) => {
          const selectedAsset = String(e.target.value);
          const position =
            positions?.find(
              (position) => position.asset.toString() === selectedAsset
            ) ?? null;
          onPositionSelect(position);
        }}
      >
        {positions?.map((position) => (
          <MenuItem
            key={position.asset.toString()}
            value={position.asset.toString()}
            className="flex items-center gap-2"
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
    </FormControl>
  );
}
