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
import { Person, Group, Mail, Language } from "@mui/icons-material";
import TenantSearch from "../TenantSearch";
import Link from "../Link";
import React, { useContext } from "react";
import { TenantContext } from "../../utils/TenantContext";

const drawerWidth = 240;

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
      <List>
        <Link href="/users" style={{ textDecoration: "none" }} color="inherit">
          <ListItem disablePadding>
            <ListItemButton disabled={tenant ? false : true}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem disablePadding>
          <ListItemButton disabled={tenant ? false : true}>
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText primary={"Groups"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton disabled={tenant ? false : true}>
            <ListItemIcon>
              <Mail />
            </ListItemIcon>
            <ListItemText primary={"Mailboxes"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton disabled={tenant ? false : true}>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText primary={"Domains"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
}
