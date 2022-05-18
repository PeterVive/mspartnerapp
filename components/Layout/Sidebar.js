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
  Box,
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
import { useState } from "react";
import { useSelector } from "react-redux";

const drawerWidth = 350;

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const tenant = useSelector((state) => state.tenant.value);

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
            <ListSubheader
              component="div"
              id="identity-and-management-list-subheader"
            >
              Identity and management
            </ListSubheader>
          }
        >
          <Link
            href={tenant ? `/${tenant.customerId}/users` : "#"}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ul>
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
            </ul>
          </Link>
          <Link
            href={tenant ? `/${tenant.customerId}/groups` : "#"}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ul>
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
            </ul>
          </Link>
          <Link
            href={tenant ? `/${tenant.customerId}/domains` : "#"}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ul>
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
            </ul>
          </Link>
        </List>
        <Divider />
        <List
          sx={{ bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="exchange-online-list-subheader">
              Exchange Online
            </ListSubheader>
          }
        >
          <Link
            href={tenant ? `/${tenant.customerId}/mailboxes` : "#"}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ul>
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
            </ul>
          </Link>
          <Link
            href={
              tenant
                ? `/${tenant.customerId}/mailboxes/organizationconfig`
                : "#"
            }
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ul>
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
            </ul>
          </Link>
        </List>
      </Box>
    </Drawer>
  );
}
