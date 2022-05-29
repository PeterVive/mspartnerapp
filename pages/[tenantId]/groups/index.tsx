import { useEffect } from "react";
import { Typography } from "@mui/material";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../components/Table/CommonTable";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { Group } from "@microsoft/microsoft-graph-types-beta";

type ExtendedGroup = Partial<Group> & { foundGroupType: string };

export default function Groups() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenantId } = router.query;

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
      const desiredURL = `/${tenant.customerId}/groups`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  const { data: groups, error } = useSWR<ExtendedGroup[]>(
    tenant
      ? `/api/tenants/${tenant.customerId}/groups?select=id,displayName,mail,groupTypes`
      : null
  );

  if (groups) {
    // Detect group type
    groups.forEach((group) => {
      if (group.groupTypes) {
        if (group.groupTypes.includes("Unified")) {
          group.foundGroupType = "Microsoft 365";
        } else if (
          group.mailEnabled == false &&
          group.securityEnabled == true
        ) {
          group.foundGroupType = "Security";
        } else if (group.mailEnabled == true && group.securityEnabled == true) {
          group.foundGroupType = "Mail-enabled security";
        } else if (
          group.mailEnabled == true &&
          group.securityEnabled == false
        ) {
          group.foundGroupType = "Distribution";
        }
      }
    });
  }

  const columns = [
    { title: "Display name", field: "displayName" },
    { title: "Mail", field: "mail" },
    {
      title: "Type",
      field: "foundGroupType",
      lookup: {
        "Microsoft 365": "Microsoft 365",
        Security: "Security",
        "Mail-enabled security": "Mail-enabled security",
        Distribution: "Distribution",
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
          <title>{tenant.displayName} - Groups</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Groups"}
            key="title"
          />
        </Head>
        <CommonTable
          title={"Groups"}
          isLoading={!groups}
          data={groups ? groups : []}
          columns={columns}
          exportFileName={tenant.displayName!}
        />
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
