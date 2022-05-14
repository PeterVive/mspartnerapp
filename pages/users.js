import * as React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useContext } from "react";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { CustomToolbar } from "../components/CustomToolbar";
import useSWR from "swr";
import { Products } from "../utils/SKUList";
import { Edit } from "@mui/icons-material";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Users() {
  const [tenant] = useContext(TenantContext);

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
          autoPageSize={true}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </>
    );
  }

  if (error) {
    content = <Alert severity="error">An error has occured.</Alert>;
  }

  return (
    <Box>
      <div style={{ height: "80vh", width: "100%" }}>{content}</div>
    </Box>
  );
}
