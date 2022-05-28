import Header from "./Header";
import Sidebar from "./Sidebar";
import { CssBaseline, Toolbar, Box } from "@mui/material";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Header></Header>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
