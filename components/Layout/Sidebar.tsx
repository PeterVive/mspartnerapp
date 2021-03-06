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
  Collapse,
} from "@mui/material";
import {
  Person,
  Group,
  Mail,
  Devices,
  Language,
  Engineering,
  Summarize,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import TenantSelect from "../TenantSelect";
import Link from "../Link";
import { useState } from "react";
import { useAppSelector } from "../../features/hooks";
import { useRouter } from "next/router";
const drawerWidth = 350;
import { Microsoftoutlook } from "@icons-pack/react-simple-icons";

export default function Sidebar() {
  const [outlookReportTabOpen, setOutlookReportTabOpen] = useState(true);

  const handleOutlookReportTabClick = () => {
    setOutlookReportTabOpen(!outlookReportTabOpen);
  };

  const router = useRouter();
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
            href={{
              pathname: "/[tenantId]/users",
              query: { tenantId: tenant?.customerId },
            }}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={router.pathname.endsWith("/users")}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary={"Users"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href={{
              pathname: "/[tenantId]/groups",
              query: { tenantId: tenant?.customerId },
            }}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={router.pathname.endsWith("/groups")}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary={"Groups"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href={{
              pathname: "/[tenantId]/domains",
              query: { tenantId: tenant?.customerId },
            }}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={router.pathname.endsWith("/domains")}
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
            href={{
              pathname: "/[tenantId]/devices",
              query: { tenantId: tenant?.customerId },
            }}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={router.pathname.endsWith("/devices")}
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
            href={{
              pathname: "/[tenantId]/mailboxes",
              query: { tenantId: tenant?.customerId },
            }}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={router.pathname.endsWith("/mailboxes")}
              >
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={"Mailboxes"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href={{
              pathname: "/[tenantId]/mailboxes/organizationconfig",
              query: { tenantId: tenant?.customerId },
            }}
            style={{ textDecoration: "none" }}
            color="inherit"
          >
            <ListItem disablePadding>
              <ListItemButton
                disabled={tenant ? false : true}
                selected={router.pathname.endsWith(
                  "/mailboxes/organizationconfig"
                )}
              >
                <ListItemIcon>
                  <Engineering />
                </ListItemIcon>
                <ListItemText primary={"Exchange Online Configuration"} />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List
          sx={{ bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="reports-list-subheader">
              Reports
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton
              disabled={tenant ? false : true}
              selected={router.pathname.endsWith("/reports/outlook")}
              onClick={handleOutlookReportTabClick}
            >
              <ListItemIcon>
                <Microsoftoutlook />
              </ListItemIcon>
              <ListItemText primary={"Outlook"} />
              {outlookReportTabOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={outlookReportTabOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link
                href={{
                  pathname: "/[tenantId]/reports/outlook/desktopVersions",
                  query: { tenantId: tenant?.customerId },
                }}
                style={{ textDecoration: "none" }}
                color="inherit"
              >
                <ListItem disablePadding>
                  <ListItemButton
                    selected={router.pathname.endsWith(
                      "/outlook/desktopVersions"
                    )}
                    sx={{ pl: 4 }}
                    disabled={tenant ? false : true}
                  >
                    <ListItemText primary="Desktop Versions" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
}
