import {
  Drawer,
  Toolbar,
  List,
  ListSubheader,
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
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

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
      <Box sx={{ overflow: "auto" }}>
        <List
          sx={{ bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Identity and management
            </ListSubheader>
          }
        >
          <Link
            href="/users"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
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
              <ListItemButton
                disabled={tenant ? false : true}
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary={"Groups"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href="/domains"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText primary={"Domains"} />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List
          sx={{ bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Exchange Online
            </ListSubheader>
          }
        >
          <Link
            href="/mailboxes"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={"Mailboxes"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href="/organizationconfig"
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemIcon>
                  <Engineering />
                </ListItemIcon>
                <ListItemText primary={"Exchange Online Configuration"} />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Box>
    </Drawer>
  );
}
