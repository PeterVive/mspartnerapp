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
  Devices,
  Language,
  Engineering,
} from "@mui/icons-material";
import TenantSelect from "../TenantSelect";
import Link from "../Link";
import { MouseEvent, useState } from "react";
import { useAppSelector } from "../../features/hooks";

const drawerWidth = 350;

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleListItemClick(event: MouseEvent<{}>, index: number) {
    setSelectedIndex(index);
  }

  const tenant = useAppSelector((state) => state.tenant.value);

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
      <TenantSelect />
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
            href={tenant ? `/${tenant.customerId}/groups` : "#"}
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
            href={tenant ? `/${tenant.customerId}/domains` : "#"}
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
            <ListSubheader
              component="div"
              id="endpoint-management-list-subheader"
            >
              Endpoint Management
            </ListSubheader>
          }
        >
          <Link
            href={tenant ? `/${tenant.customerId}/devices` : "#"}
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
                  <Devices />
                </ListItemIcon>
                <ListItemText primary={"Devices"} />
              </ListItemButton>
            </ListItem>
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
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={"Mailboxes"} />
              </ListItemButton>
            </ListItem>
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
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
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
