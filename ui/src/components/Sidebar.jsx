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
import MenuIcon from "@mui/icons-material/Menu";

import { logo, minLogo } from "../assets";
import { useAuth } from "../contexts/Auth";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [ open, setOpen ] = useState(false);

  const handleLogout = () => {
    logout();
  }

  const handleToggleMenu = () => {
    setOpen(!open);
  }

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
          <ListItemButton component={Link} to="/dashboard" selected={location.pathname === '/dashboard'}>
            <ListItemIcon>
              <DashboardIcon/>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/items" selected={location.pathname === "/items"}>
            <ListItemIcon>
              <CheckroomIcon/>
            </ListItemIcon>
            <ListItemText primary="Items" />
          </ListItemButton>
        </List>

      </Drawer>
    </>
  );
}

export default Sidebar;