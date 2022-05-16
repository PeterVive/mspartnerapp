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

  let { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/mailboxes` : null
  );

  if (data) {
    // Remove DiscoverySearchMailbox
    data = data.filter(
      (mailbox) =>
        !mailbox.UserPrincipalName.startsWith("DiscoverySearchMailbox")
    );

    // Convert alias data to more table-friendly format
    data.forEach((mailbox, index) => {
      const aliasList = [];
      mailbox.EmailAddresses.forEach((alias) => {
        if (alias.startsWith("smtp:")) {
          aliasList.push(alias.slice(5));
        }
      });
      mailbox.Alias = aliasList.join(",\r\n");
    });
  }

  const columns = [
    { title: "UPN", field: "UserPrincipalName" },
    { title: "Display name", field: "DisplayName" },
    { title: "Alias", field: "Alias" },
    { title: "Type", field: "RecipientTypeDetails" },
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
          <title>{tenant.displayName} - Mailboxes</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Mailboxes"}
            key="title"
          />
        </Head>
        <CommonTable
          title={"Mailboxes"}
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
