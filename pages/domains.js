import * as React from "react";
import { Typography } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolbar } from "../components/CustomToolbar";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Domains() {
  const { data: session, status } = useSession({
    required: true,
  });

  const [tenant] = React.useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/domains` : null,
    fetcher
  );

  const columns = [
    {
      field: "id",
      headerName: "Domain name",
      width: 400,
    },
    { field: "isVerified", headerName: "Verified", width: 600 },
  ];

  let rows = [];

  if (data) {
    rows = data;
  }

  let content;
  if (!tenant) {
    return (
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
          Domains
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
        <title>{tenant.displayName} - Domains</title>
        <meta
          property="og:title"
          content={tenant.displayName + " Domains"}
          key="title"
        />
      </Head>
      {content}
    </div>
  );
}
