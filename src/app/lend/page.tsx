"use client";

import OffersTable from "@/components/offersTable";
import RequestsTable from "@/components/requestsTable";
import { Stack } from "@mui/material";

export default function Lend() {
  return (
    <Stack spacing={2}>
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          paddingTop: 50,
          paddingBottom: 50,
        }}
      >
        Lend
      </h1>
      <RequestsTable />
      <OffersTable />
    </Stack>
  );
}
