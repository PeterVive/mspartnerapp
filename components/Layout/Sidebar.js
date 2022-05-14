import {
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Person,
  Group,
  Mail,
  Language,
  Engineering,
} from "@mui/icons-material";
import TenantSearch from "../TenantSearch";
import Link from "../Link";
import React, { useContext } from "react";
import { TenantContext } from "../../utils/TenantContext";
import { Box } from "@mui/system";

const drawerWidth = 350;

export default function Sidebar() {
  const [tenant] = useContext(TenantContext);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <TenantSearch />
      <Divider />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <Link
            href="/users"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton disabled={tenant ? false : true}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary={"Users"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href="/groups"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton disabled={tenant ? false : true}>
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary={"Groups"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href="/mailboxes"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton disabled={tenant ? false : true}>
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={"Mailboxes"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href="/domains"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton disabled={tenant ? false : true}>
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText primary={"Domains"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href="/organizationconfig"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton disabled={tenant ? false : true}>
                <ListItemIcon>
                  <Engineering />
                </ListItemIcon>
                <ListItemText primary={"Exchange Online Configuration"} />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Box>
      <Divider />
    </Drawer>
  );
}
