"use client";

import RequestsTable from "@/components/requestsTable";
import { fetchRequests } from "@/utils/fetchRequests";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

export default function Lend() {
  const [requests, setRequests] = useState<
    [`0x${string}`, bigint, bigint, bigint][]
  >([]);
  const publicClient = usePublicClient();
  useEffect(() => {
    if (!publicClient) return;
    fetchRequests({ publicClient }).then(setRequests);
  }, [publicClient]);

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
    </Stack>
  );
}
