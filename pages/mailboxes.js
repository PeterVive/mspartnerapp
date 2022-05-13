import * as React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useContext } from "react";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid } from "@mui/x-data-grid";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Mailboxes() {
  const [tenant] = useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/mailboxes` : null,
    fetcher
  );

  let rows = [];

  if (data) {
    if (data.errorMessage) {
      return (
        <Container maxWidth="sm">
          <Box sx={{ my: 4 }}>
            <Alert severity="error">An error has occured.</Alert>
          </Box>
        </Container>
      );
    }
    rows = data;
    data.forEach((mailbox) => {
      mailbox.aliasList = [];
      mailbox.EmailAddresses.forEach((alias) => {
        if (alias.startsWith("smtp:")) {
          mailbox.aliasList.push(alias.slice(5));
        }
      });
      mailbox.aliasList = mailbox.aliasList.join("\r\n");
    });
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
    { field: "UserPrincipalName", headerName: "UPN", width: 300 },
    {
      field: "DisplayName",
      headerName: "Display name",
      width: 150,
    },
    { field: "aliasList", headerName: "Aliases", width: 600 },
    { field: "RecipientType", headerName: "Type", width: 600 },
  ];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Mailboxes
        <div style={{ height: 400, width: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={!data}
                getRowId={(row) => row["@odata.id"]}
              />
            </div>
          </div>
        </div>
      </Typography>
    </Container>
  );
}
