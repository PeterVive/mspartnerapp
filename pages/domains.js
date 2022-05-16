import * as React from "react";
import { Typography } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../components/CommonTable";

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
        <CommonTable
          title={"Domains"}
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
