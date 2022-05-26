import { useEffect } from "react";
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setTenant } from "../../../../features/tenantSlice";
import useSWR from "swr";
import { Products } from "../../../../utils/SKUList";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../../components/CommonTable";
import { Check, Close, Edit } from "@mui/icons-material/";
import { useRouter } from "next/router";
import _ from "lodash";

export default function Users() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tenantId, userid } = router.query;
  console.log(userid);
  const { data: session, status } = useSession({
    required: true,
  });

  const tenant = useSelector((state) => state.tenant.value);

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

  const { data: user, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/users/${userid}` : null
  );

  if (!user) {
    return <div>loading..</div>;
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
        <Head>
          <title>{tenant.displayName} - Users</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Edit user"}
            key="title"
          />
        </Head>
        <div>Display name: {user.displayName}</div>
        <div>User Principal Name (UPN): {user.userPrincipalName}</div>
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
