import * as React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useContext } from "react";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolbar } from "../components/CustomToolbar";
import useSWR from "swr";
import { useSession } from "next-auth/react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Mailboxes() {
  const { data: session, status } = useSession({
    required: true,
  });
  const [tenant] = useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/mailboxes` : null,
    fetcher
  );

  let rows = [];

  if (data) {
    rows = data;
  }

  const columns = [
    { field: "UserPrincipalName", headerName: "UPN", width: 300 },
    {
      field: "DisplayName",
      headerName: "Display name",
      width: 150,
    },
    {
      field: "EmailAddresses",
      headerName: "Aliases",
      width: 600,
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        const aliasList = [];
        params.value.forEach((alias) => {
          if (alias.startsWith("smtp:")) {
            aliasList.push(alias.slice(5));
          }
        });
        return aliasList.join(",");
      },
    },
    { field: "RecipientTypeDetails", headerName: "Type", width: 200 },
  ];

  let content;

  if (!tenant) {
    content = (
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          No tenant selected.
        </Typography>
      </>
    );
  } else {
    content = (
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          Mailboxes
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={!data}
          getRowId={(row) => row["@odata.id"]}
          autoPageSize={true}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </>
    );
  }

  if (data || error) {
    if (data.errorMessage || error) {
      content = <Alert severity="error">An error has occured.</Alert>;
    }
  }

  return (
    <Box>
      <div style={{ height: "80vh", width: "100%" }}>{content}</div>
    </Box>
  );
}
