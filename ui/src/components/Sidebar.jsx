import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  
  Box, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar
} from "@mui/material";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptIcon from '@mui/icons-material/Receipt';

import { logo, minLogo } from "../assets";
import { useAuth } from "../contexts/Auth";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [ open, setOpen ] = useState(false);

  const MENU_ITEMS = [
    { label: "Dashboard", path: "/dashboard", icon:<DashboardIcon/> },
    { label: "Items", path: "/items", icon: <CheckroomIcon/> },
    { label: "Customers", path: "/customers", icon: <GroupIcon/> },
    { label: "Transactions", path: "/transactions", icon: <ReceiptIcon/> }
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
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          zIndex: 1,
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleToggleMenu}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon/>
          </IconButton>
        </Toolbar>
      </Box>

      <Drawer
        variant='permanent'
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
          <img src={logo} alt="Logo" style={{ padding: '10px', boxSizing: 'border-box', height: '150px', width: '150px', alignSelf: 'center' }} />
        </Link> 

        <List>
          {MENU_ITEMS.map(renderMenuItem)}
        </List>

      </Drawer>
    </>
  );
}

export default Sidebar;