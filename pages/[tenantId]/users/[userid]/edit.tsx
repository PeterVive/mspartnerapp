import { useEffect } from "react";
import { Paper, Grid, Typography } from "@mui/material";
import { setTenant } from "../../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";

import { useRouter } from "next/router";
import _ from "lodash";
import UserEdit from "../../../../components/UserEdit";
import { useAppDispatch, useAppSelector } from "../../../../features/hooks";
import { Domain, User } from "@microsoft/microsoft-graph-types-beta";

export default function Users() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenantId, userid } = router.query;

  const { data: session, status } = useSession({
    required: true,
  });

  const tenant = useAppSelector((state) => state.tenant.value);

  // Load tenantData if Tenant is not set in store, but is in query parameter.
  const { data: tenantData, error: tenantError } = useSWR(
    !tenant && tenantId ? `/api/tenants/${tenantId}/` : null
  );

  useEffect(() => {
    // When tenanData has loaded, set the state in store to update other components.
    if (tenantData) {
      dispatch(setTenant(tenantData));
    }

    // When tenant state in store is set, push the current tenant to URL.
    if (tenant) {
      const desiredURL = `/${tenant.customerId}/users/${userid}/edit`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  const { data: user, error: userError } = useSWR<User>(
    tenant ? `/api/tenants/${tenant.customerId}/users/${userid}` : null
  );

  const { data: domains, error: domainError } = useSWR<Domain[]>(
    tenant ? `/api/tenants/${tenant.customerId}/domains` : null
  );

  if (!user || !domains) {
    return <div>loading..</div>;
  }

  const verifiedDomains: Domain[] = [];
  domains.forEach(function (domain: Domain) {
    if (domain.isVerified) {
      verifiedDomains.push(domain);
    }
  });

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
            content={tenant.displayName + " Edit user"}
            key="title"
          />
        </Head>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h4" sx={{ ml: 2, mb: 2 }}>
              User information
            </Typography>
            <UserEdit tenant={tenant} user={user} domains={domains} />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" sx={{ ml: 2, mb: 2 }}>
              Reset password
            </Typography>
            <Paper>TODO</Paper>
          </Grid>
        </Grid>
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
