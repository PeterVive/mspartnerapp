import * as React from "react";
import { Typography } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolbar } from "../components/CustomToolbar";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Groups() {
  const { data: session, status } = useSession({
    required: true,
  });
  const [tenant] = React.useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/groups` : null,
    fetcher
  );

  const columns = [
    {
      field: "displayName",
      headerName: "Display name",
      width: 400,
    },
    { field: "mail", headerName: "Mail", width: 300 },
  ];

  let rows = [];

  if (data) {
    rows = data;
  }

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
          Groups
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={!data}
          error={error}
          autoPageSize={true}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </>
    );
  }

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <Head>
        <title>{tenant.displayName} - Groups</title>
        <meta
          property="og:title"
          content={tenant.displayName + " Groups"}
          key="title"
        />
      </Head>
      {content}
    </div>
  );
}
