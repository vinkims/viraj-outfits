import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { useAuth } from "../contexts/Auth";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enterignScreen,
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiToolbar-root': {
          minHeight: 48,
          [theme.breakpoints.up('sm')]: {
            minHeight: 56
          }
        }
      },
    },
  ],
  '& .MuiToolbar-root': {
    minHeight: 48,
    [theme.breakpoints.up('sm')]: {
      minHeight: 56
    }
  }
}));

const SideBar = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const AppBarDrawer = () => {
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useAuth();
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ open, setOpen ] = useState(false);

  const MENU_ITEMS = [
    { label: "Dashboard", path: "/dashboard", icon:<DashboardIcon/> },
    { label: "Items", path: "/items", icon: <CheckroomIcon/> },
    { label: "Customers", path: "/customers", icon: <GroupIcon/> },
    { label: "Transactions", path: "/transactions", icon: <ReceiptIcon/> },
    { label: "Users", path: "/users", icon: <AssignmentIndIcon/> },
    { label: "Expenses", path: "/expenses", icon: <PaymentIcon/> }
  ];

  const handleDrawerClose = () => {
    setOpen(false);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  }

  const handleLogout = () => {
    logout();
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const renderMenuItem = ({ label, path, icon }) => (
    <ListItemButton
      key={path}
      component={Link}
      to={path}
      selected={location.pathname === path}
      sx={[
        {
          minHeight: 48,
          px: 2.5
        },
        open 
        ? { justifyContent: "initial" }
        : { justifyContent: "center" }
      ]}
    >
      <ListItemIcon
        sx={[
          {
            minWidth: 0,
            justifyContent: "center",
          },
          open
          ? { mr: 3 }
          : { mr: "auto" }
        ]}
      >
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={label} 
        sx={[
          open
          ? { opacity: 1 }
          : { opacity: 0 }
        ]}
      />
    </ListItemButton>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <StyledAppBar position="fixed" open={open} sx={{ backgroundColor: "#20232A" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" }
            ]}
          >
            <MenuIcon/>
          </IconButton>
          <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" noWrap component="div">
              V-Raj Outfits
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }}/>
          <div style={{ alignSelf: "flex-end" }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenu}
            >
              <AccountCircleIcon/>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </StyledAppBar>
      <SideBar variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
          </IconButton>
        </DrawerHeader>
        <List>
          {MENU_ITEMS.map(renderMenuItem)}
        </List>
      </SideBar>
    </Box>
  );
}

export default AppBarDrawer;