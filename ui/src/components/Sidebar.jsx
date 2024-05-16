import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Box, 
  Drawer, 
  IconButton, 
  Toolbar 
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";

import { vraj } from "../assets";
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
          <img src={vraj} alt="Logo" style={{ padding: '10px', boxSizing: 'border-box' }} />
        </Link> 
      </Drawer>
    </>
  );
}

export default Sidebar;