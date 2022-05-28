import { useEffect } from "react";
import { Typography } from "@mui/material";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../components/CommonTable";
import { useRouter } from "next/router";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { Mailbox } from "../../../utils/customGraphTypes";
import { Contract } from "@microsoft/microsoft-graph-types-beta";

export default function Users() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenantId } = router.query;

  const { data: session, status } = useSession({
    required: true,
  });

  const tenant = useAppSelector((state) => state.tenant.value);

  // Load tenantData if Tenant is not set in store, but is in query parameter.
  const { data: tenantData, error: tenantError } = useSWR<Contract>(
    !tenant && tenantId ? `/api/tenants/${tenantId}/` : null
  );

  useEffect(() => {
    // When tenanData has loaded, set the state in store to update other components.
    if (tenantData) {
      dispatch(setTenant(tenantData));
    }

    // When tenant state in store is set, push the current tenant to URL.
    if (tenant) {
      const desiredURL = `/${tenant.customerId}/mailboxes`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  let { data: mailboxes, error } = useSWR<Mailbox[]>(
    tenant ? `/api/tenants/${tenant.customerId}/mailboxes` : null
  );

  if (mailboxes) {
    // Remove DiscoverySearchMailbox
    mailboxes = mailboxes.filter(
      (mailbox: Mailbox) =>
        !mailbox.UserPrincipalName.startsWith("DiscoverySearchMailbox")
    );

    // Convert alias data to more table-friendly format
    mailboxes.forEach((mailbox) => {
      const aliasList: string[] = [];
      mailbox.EmailAddresses.forEach((alias) => {
        if (alias.startsWith("smtp:")) {
          aliasList.push(alias.slice(5));
        }
      });
      mailbox.Alias = aliasList.join(",\r\n");
    });
  }

  const uniqueMailboxTypes = Object.fromEntries(
    _.uniq(_.map(mailboxes, "RecipientTypeDetails")).map((e) => [e, e])
  );

  const columns = [
    { title: "UPN", field: "UserPrincipalName" },
    { title: "Display name", field: "DisplayName" },
    { title: "Alias", field: "Alias" },
    {
      title: "Type",
      field: "RecipientTypeDetails",
      lookup: uniqueMailboxTypes,
    },
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
          isLoading={!mailboxes}
          data={mailboxes ? mailboxes : []}
          columns={columns}
          error={error}
          exportFileName={tenant.displayName!}
        />
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
