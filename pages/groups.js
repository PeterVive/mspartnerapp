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
    tenant ? `/api/tenants/${tenant.customerId}/groups` : null
  );

  if (data) {
    // Detect group type
    data.forEach((group) => {
      if (group.groupTypes.includes("Unified")) {
        group.foundGroupType = "Microsoft 365";
      } else if (group.mailEnabled == false && group.securityEnabled == true) {
        group.foundGroupType = "Security";
      } else if (group.mailEnabled == true && group.securityEnabled == true) {
        group.foundGroupType = "Mail-enabled security";
      } else if (group.mailEnabled == true && group.securityEnabled == false) {
        group.foundGroupType = "Distribution";
      }
    });
  }

  const columns = [
    { title: "Display name", field: "displayName" },
    { title: "Mail", field: "mail" },
    { title: "Type", field: "foundGroupType" },
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
          <title>{tenant.displayName} - Groups</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Groups"}
            key="title"
          />
        </Head>
        <CommonTable
          title={"Groups"}
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
