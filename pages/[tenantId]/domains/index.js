import { useEffect } from "react";
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../components/CommonTable";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tenantId } = router.query;

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
      const desiredURL = `/${tenant.customerId}/domains`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  const { data, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/domains` : null
  );

  const columns = [
    { title: "Domain name", field: "id" },
    {
      title: "Verified",
      field: "isVerified",
      lookup: {
        true: "Yes",
        false: "No",
      },
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
