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
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

const drawerWidth = 240;

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
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const { pathname } = useRouter();

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
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
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((menuItem) => (
            <Link href={menuItem.link} underline="none" color="inherit" key={menuItem.id}>
              <ListItem disablePadding sx={{ backgroundColor: pathname === menuItem.link ? "primary.main" : "transparent", color: pathname === menuItem.link ? "white" : "inherit" }}>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon component={menuItem.icon} sx={{ color: pathname === menuItem.link ? "white" : "inherit" }} />
                  </ListItemIcon>
                  <ListItemText primary={menuItem.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <List sx={{ width: "100%", position: "absolute", bottom: 0, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
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
