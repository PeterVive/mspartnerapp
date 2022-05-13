import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../components/Link";

export default function Index() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to MSPartnerApp
        </Typography>
        Select a tenant on the left.
      </Box>
    </Container>
  );
}
