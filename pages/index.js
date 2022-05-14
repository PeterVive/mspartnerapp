import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSession } from "next-auth/react";

export default function Index() {
  const { data: session, status } = useSession({
    required: true,
  });
  return (
    <Box>
      <div style={{ height: "80vh", width: "100%" }}>
        <Typography variant="h3">Welcome to MSPartnerApp</Typography>
        <Typography variant="h5">
          Pick a tenant on the left to get started.
        </Typography>
      </div>
    </Box>
  );
}
