import * as React from "react";
import { Typography, Box } from "@mui/material/";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function Index() {
  const { data: session, status } = useSession({
    required: true,
  });
  return (
    <Box>
      <Head>
        <title>MSPartnerApp - Dashboard</title>
        <meta
          property="og:title"
          content="MSPartnerApp - Dashboard"
          key="title"
        />
      </Head>
      <div style={{ height: "80vh", width: "100%" }}>
        <Typography variant="h3">Welcome to MSPartnerApp</Typography>
        <Typography variant="h5">
          Pick a tenant on the left to get started.
        </Typography>
      </div>
    </Box>
  );
}
