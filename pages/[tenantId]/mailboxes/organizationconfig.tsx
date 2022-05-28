import { useEffect } from "react";
import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { Contract } from "@microsoft/microsoft-graph-types-beta";
import { OrganizationConfig } from "../../../utils/customGraphTypes";

export default function OrganizationConfig() {
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
      const desiredURL = `/${tenant.customerId}/mailboxes/organizationconfig`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  const { data, error } = useSWR<OrganizationConfig>(
    tenant
      ? `/api/tenants/${tenant.customerId}/mailboxes/getOrganizationConfig`
      : null
  );

  if (!data) {
    return <CircularProgress color="inherit" />;
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
    content = <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  if (error) {
    content = <Alert severity="error">An error has occured.</Alert>;
  }

  return (
    <Box>
      <div style={{ height: "80vh", width: "100%" }}>{content}</div>
    </Box>
  );
}
