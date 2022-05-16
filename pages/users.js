import * as React from "react";
import { Typography } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import useSWR from "swr";
import { Products } from "../utils/SKUList";
import { useSession } from "next-auth/react";
import Head from "next/head";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Users() {
  const { data: session, status } = useSession({
    required: true,
  });
  const [tenant] = React.useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/users` : null,
    fetcher
  );

  if (data) {
    // Convert license data to more table-friendly format
    data.forEach((user) => {
      const allLicenses = [];
      user.assignedLicenses.forEach((assignedLicense) => {
        if (assignedLicense.skuId) {
          const product = Products.find(
            (product) => product.GUID === assignedLicense.skuId
          );
          allLicenses.push(product.Product_Display_Name);
        }
      });
      user.displayableLicenses = allLicenses.join(" + ");
    });
  }

  const columns = [
    { title: "UPN", field: "userPrincipalName" },
    { title: "Display name", field: "displayName" },
    { title: "Licenses", field: "displayableLicenses" },
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
          <title>{tenant.displayName} - Users</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Users"}
            key="title"
          />
        </Head>
        <MaterialTable
          title="Users"
          data={data}
          columns={columns}
          isLoading={!data}
          error={error}
          options={{
            tableLayout: "fixed",
            columnResizable: true,
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
                      " Users " +
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
                      " Users " +
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
