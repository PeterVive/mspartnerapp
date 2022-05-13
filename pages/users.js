import * as React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useContext } from "react";
import { TenantContext } from "../utils/TenantContext";
import { DataGrid } from "@mui/x-data-grid";
import useSWR from "swr";
import { Products } from "../utils/SKUList";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Users() {
  const [tenant] = useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/users` : null,
    fetcher
  );

  let rows = [];

  if (error) {
    return <Alert severity="error">An error has occured.</Alert>;
  }

  if (data) {
    rows = data;

    // Convert SKU to product display names
    data.forEach((user) => {
      let allLicenses = [];
      user.assignedLicenses.forEach((license) => {
        if (license.skuId) {
          let product = Products.find(
            (product) => product.GUID === license.skuId
          );
          allLicenses.push(product.Product_Display_Name);
        }
      });
      user.licenseString = allLicenses.join(" + ");
      console.log(user.licenseString);
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
    { field: "userPrincipalName", headerName: "UPN", width: 300 },
    {
      field: "displayName",
      headerName: "Display name",
      width: 150,
    },
    { field: "licenseString", headerName: "Licenses", width: 600 },
  ];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Users
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
