import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-based navigation
  const navLinks = [];
  if (user?.role === 'farmer') {
    navLinks.push({ label: 'Dashboard', path: '/farmer/dashboard' });
    navLinks.push({ label: 'Profile', path: '/profile' });
  } else if (user?.role === 'inspector') {
    navLinks.push({ label: 'Dashboard', path: '/inspector/dashboard' });
    navLinks.push({ label: 'Profile', path: '/profile' });
  } else if (user?.role === 'certificate_issuer') {
    navLinks.push({ label: 'Dashboard', path: '/certifier/dashboard' });
    navLinks.push({ label: 'Profile', path: '/profile' });
  }

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #1a2980 0%, #26d0ce 100%)', boxShadow: 3 }}>
      <Toolbar>
        <AssignmentTurnedInIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
          Organic Certification Portal
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navLinks.map((link) => (
            <Button key={link.label} color="inherit" onClick={() => navigate(link.path)} sx={{ fontWeight: 600 }}>
              {link.label}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {navLinks.map((link) => (
              <MenuItem key={link.label} onClick={() => { navigate(link.path); handleClose(); }}>
                {link.label}
              </MenuItem>
            ))}
            <MenuItem onClick={() => setLogoutDialogOpen(true)}>Logout</MenuItem>
          </Menu>
        </Box>
        {user && (
          <Tooltip title={user.role}>
            <Avatar sx={{ bgcolor: 'primary.main', ml: 2 }}>
              {user.username?.[0]?.toUpperCase() || user.role?.[0]?.toUpperCase()}
            </Avatar>
          </Tooltip>
        )}
        <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} sx={{ ml: 2, fontWeight: 600, display: { xs: 'none', md: 'inline-flex' } }}>
          Logout
        </Button>
      </Toolbar>
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setLogoutDialogOpen(false);
              handleLogout();
            }}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default NavBar; 