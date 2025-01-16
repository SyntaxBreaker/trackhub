import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Box,
  Drawer,
  CssBaseline,
  IconButton,
  ListItemIcon,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemButton,
  Link,
  Icon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListIcon from "@mui/icons-material/List";
import Header from "../Header";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LoginIcon from "@mui/icons-material/Login";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

const sidebarWidth = 240;

const menuItems = [
  {
    id: "projectList",
    name: "Project list",
    icon: ListIcon,
    link: "/",
  },
  {
    id: "stats",
    name: "Your stats",
    icon: QueryStatsIcon,
    link: "/stats",
  },
];

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${sidebarWidth}px)`,
    marginLeft: `${sidebarWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const { pathname } = useRouter();

  const handleSidebarOpen = () => {
    setOpen(true);
  };

  const handleSidebarClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            onClick={handleSidebarOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Header />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <SidebarHeader>
          <IconButton onClick={handleSidebarClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </SidebarHeader>
        <Divider />
        <List>
          {menuItems.map((menuItem) => (
            <Link
              href={menuItem.link}
              underline="none"
              color="inherit"
              key={menuItem.id}
            >
              <ListItem
                disablePadding
                sx={{
                  backgroundColor:
                    pathname === menuItem.link ? "primary.main" : "transparent",
                  color: pathname === menuItem.link ? "white" : "inherit",
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Icon
                      component={menuItem.icon}
                      sx={{
                        color: pathname === menuItem.link ? "white" : "inherit",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={menuItem.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <List
          sx={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          {user ? (
            <Link href="/api/auth/logout" underline="none" color="inherit">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </Link>
          ) : (
            <Link href="/api/auth/login" underline="none" color="inherit">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>
    </Box>
  );
}
