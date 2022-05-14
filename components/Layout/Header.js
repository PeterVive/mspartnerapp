import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  console.log(session);
  if (!session) {
    return (
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            MSPartnerApp
          </Typography>
          <Button color="inherit" onClick={() => signIn()}>
            Sign in
          </Button>
        </Toolbar>
      </AppBar>
    );
  } else {
    return (
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            MSPartnerApp
          </Typography>
          Signed in as {session.user.email}
          <Button color="inherit" onClick={() => signOut()}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}
