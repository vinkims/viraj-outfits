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
  Toolbar,
  Typography
} from "@mui/material";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptIcon from '@mui/icons-material/Receipt';

import { darkLogo } from "../assets";
import { useAuth } from "../contexts/Auth";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [ open, setOpen ] = useState(false);

  const MENU_ITEMS = [
    { label: "Dashboard", path: "/dashboard", icon:<DashboardIcon/> },
    { label: "Items", path: "/items", icon: <CheckroomIcon/> },
    { label: "Customers", path: "/customers", icon: <GroupIcon/> },
    { label: "Transactions", path: "/transactions", icon: <ReceiptIcon/> },
    { label: "Users", path: "/users", icon: <ManageAccountsIcon/> }
  ]

  const handleLogout = () => {
    logout();
  }

  const handleToggleMenu = () => {
    setOpen(!open);
  }

  const renderMenuItem = ({ label, path, icon }) => (
    <ListItemButton
      key={path}
      component={Link}
      to={path}
      selected={location.pathname === path}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleToggleMenu}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            V-Raj Outfits
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant='persistent'
        open={open}
        onClose={handleToggleMenu}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box'
          }
        }}
      >

        {/* Logo section */}
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={darkLogo} alt="Logo" style={{ padding: '10px', boxSizing: 'border-box', height: 'auto', width: '100%', alignSelf: 'center' }} />
        </Link> 

        <List>
          {MENU_ITEMS.map(renderMenuItem)}
        </List>

      </Drawer>
    </>
  );
}

export default Sidebar;