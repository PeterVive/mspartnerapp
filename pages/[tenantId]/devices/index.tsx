import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../components/CommonTable";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { Contract, Device } from "@microsoft/microsoft-graph-types-beta";

export default function Devices() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenantId } = router.query;

  const { data: session, status } = useSession({
    required: true,
  });

  const [columns, setColumns] = useState([
    { title: "Display name", field: "displayName" },
    { title: "Manufacturer", field: "manufacturer" },
    { title: "Model", field: "model" },
    {
      title: "Enrollment type",
      field: "enrollmentType",
      lookup: {
        OnPremiseCoManaged: "Azure AD Hybrid-joined",
        AzureDomainJoined: "Azure AD Joined",
        null: "Registrered",
      },
    },
  ]);

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
      const desiredURL = `/${tenant.customerId}/devices`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  const { data: devices, error } = useSWR<Device[]>(
    tenant ? `/api/tenants/${tenant.customerId}/devices` : null
  );

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
          <title>{tenant.displayName} - devices</title>
          <meta
            property="og:title"
            content={tenant.displayName + " devices"}
            key="title"
          />
        </Head>
        <CommonTable
          title={"Devices"}
          data={devices ? devices : []}
          columns={columns}
          isLoading={!devices}
          error={error}
          exportFileName={tenant.displayName!.toString()}
        />
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
