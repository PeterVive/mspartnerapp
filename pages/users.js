import * as React from "react";
import { Typography } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import useSWR from "swr";
import { Products } from "../utils/SKUList";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../components/CommonTable";

export default function Users() {
  const { data: session, status } = useSession({
    required: true,
  });
  const [tenant] = React.useContext(TenantContext);

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/users` : null
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
    { title: "Account enabled", field: "accountEnabled", hidden: true },
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
        <CommonTable
          title={"Users"}
          data={data}
          columns={columns}
          error={error}
          exportFileName={tenant.displayName}
        />
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
