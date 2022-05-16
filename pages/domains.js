import * as React from "react";
import { Typography } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";

export default function Users() {
  const { data: session, status } = useSession({
    required: true,
  });
  const [tenant] = React.useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/domains` : null
  );

  const columns = [
    { title: "Domain name", field: "id" },
    { title: "Verified", field: "isVerified" },
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
        <Head>
          <title>{tenant.displayName} - Domains</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Domains"}
            key="title"
          />
        </Head>
        <MaterialTable
          title="Domains"
          data={data}
          columns={columns}
          isLoading={!data}
          error={error}
          options={{
            tableLayout: "fixed",
            columnResizable: true,
            columnsButton: true,
            pageSize: 10,
            exportMenu: [
              {
                label: "Export PDF",
                //// You can do whatever you wish in this function. We provide the
                //// raw table columns and table data for you to modify, if needed.
                // exportFunc: (cols, datas) => console.log({ cols, datas })
                exportFunc: (cols, datas) =>
                  ExportPdf(
                    cols,
                    datas,
                    tenant.displayName +
                      " Domains " +
                      new Date().toLocaleDateString()
                  ),
              },
              {
                label: "Export CSV",
                exportFunc: (cols, datas) =>
                  ExportCsv(
                    cols,
                    datas,
                    tenant.displayName +
                      " Domains " +
                      new Date().toLocaleDateString()
                  ),
              },
            ],
          }}
        />
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
