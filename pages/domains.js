import * as React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useContext } from "react";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid } from "@mui/x-data-grid";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Domains() {
  const [tenant] = useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/domains` : null,
    fetcher
  );

  let rows = [];

  if (error) {
    return <Alert severity="error">An error has occured.</Alert>;
  }

  if (data) {
    rows = data;
  }

  if (!tenant) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            No tenant selected.
          </Typography>
        </Box>
      </Container>
    );
  }

  const columns = [
    {
      field: "id",
      headerName: "Domain name",
      width: 150,
    },
    { field: "isVerified", headerName: "Verified", width: 600 },
  ];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Domains
        <div style={{ height: 400, width: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid rows={rows} columns={columns} loading={!data} />
            </div>
          </div>
        </div>
      </Typography>
    </Container>
  );
}
