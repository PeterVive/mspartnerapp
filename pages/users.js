import * as React from "react";
import { Typography } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { CustomToolbar } from "../components/CustomToolbar";
import useSWR from "swr";
import { Products } from "../utils/SKUList";
import { Edit } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Head from "next/head";

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

  const columns = [
    { field: "userPrincipalName", headerName: "UPN", width: 400 },
    {
      field: "displayName",
      headerName: "Display name",
      width: 400,
    },
    {
      field: "assignedLicenses",
      headerName: "Licenses",
      width: 600,
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        let allLicenses = [];
        params.value.forEach((license) => {
          if (license.skuId) {
            let product = Products.find(
              (product) => product.GUID === license.skuId
            );
            allLicenses.push(product.Product_Display_Name);
          }
        });
        return allLicenses.join(" + ");
      },
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id}
          icon={<Edit />}
          onClick={console.log("Trying to edit " + params.id)}
          label="Edit"
        />,
      ],
    },
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
          Users
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
        <title>{tenant.displayName} - Users</title>
        <meta
          property="og:title"
          content={tenant.displayName + " Users"}
          key="title"
        />
      </Head>
      {content}
    </div>
  );
}
