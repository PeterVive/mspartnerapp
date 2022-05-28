import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          MSPartnerApp
        </Typography>
        {session ? `Signed in as ${session!.user!.email}` : "Redirecting.."}
        <Button color="inherit" onClick={() => signOut()}>
          Sign out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
