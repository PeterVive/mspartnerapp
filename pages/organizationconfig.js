import * as React from "react";
import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import { TenantContext } from "../utils/TenantContext";
import useSWR from "swr";
import { useSession } from "next-auth/react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function OrganizationConfig() {
  const { data: session, status } = useSession({
    required: true,
  });
  const [tenant] = React.useContext(TenantContext);

  const { data, error } = useSWR(
    tenant
      ? `/api/tenants/${tenant.customerId}/mailboxes/getOrganizationConfig`
      : null,
    fetcher
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
