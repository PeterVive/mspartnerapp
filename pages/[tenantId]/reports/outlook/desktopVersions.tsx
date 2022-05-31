import { useEffect } from "react";
import { setTenant } from "../../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../features/hooks";
import type { Contract } from "@microsoft/microsoft-graph-types-beta";
import OutlookDesktopVersionReportTable from "../../../../components/Table/Reports/OutlookDesktopVersionReportTable";
import OutlookDesktopVersionReportChart from "../../../../components/Table/Reports/OutlookDesktopVersionReportChart";
import { Paper, Grid, Typography } from "@mui/material";

export default function OutlookDesktopVersionsReport() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenantId } = router.query;

  useSession({
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
      const desiredURL = `/${tenant.customerId}/reports/outlook/desktopVersions`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  const { data: report, error } = useSWR<any[]>(
    tenant
      ? `/api/tenants/${tenant.customerId}/reports/outlook/desktopVersionReport`
      : null
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
          <title>{tenant.displayName} - Reports</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Reports"}
            key="title"
          />
        </Head>
        <Typography variant="h4" sx={{ ml: 2, mb: 2 }}>
          Outlook Desktop Versions Report
        </Typography>
        <Typography variant="subtitle1" sx={{ ml: 2, mb: 2 }}>
          Useful for finding out which Outlook Desktop version your customers
          use.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <OutlookDesktopVersionReportTable report={report} tenant={tenant} />
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <OutlookDesktopVersionReportChart
                report={report}
                tenant={tenant}
              />
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
