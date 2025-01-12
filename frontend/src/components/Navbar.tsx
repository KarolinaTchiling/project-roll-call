import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import { Link , useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

// This is a navigation bar component which routes to different pages
const pages = [
  { label: 'Roll Call Report', path: '/today' },
  { label: 'Dashboard', path: '/dashboard' },
  // { label: 'History', path: '/history' },
  // { label: 'Insights', path: '/insights' },
];

const settings = ['Logout', 'Google Calendar'];

function ResponsiveAppBar() {
  const location = useLocation()
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [profilePic, setProfilePic] = React.useState<string>('/static/images/avatar/2.jpg'); // Default avatar

  React.useEffect(() => {
    // Fetch profile picture
    const fetchProfilePic = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/pfp`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setProfilePic(data);
        } else {
          console.error('Failed to fetch profile picture');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();
  }, []); // Run only once on component mount

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include', // Include cookies if session-based auth is used
      });
      if (response.ok) {
        await response.json();
        navigate('/'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  return (
    <AppBar position="static" sx={{ backgroundColor: '#D9E5D6' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          {/* Logo */}
          <Link to="/today" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <CalendarIcon sx={{ fontSize: 45, mr: 1, color: 'black' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: '.1rem',
                color: 'black',
                textDecoration: 'none',
                fontSize: '1.8rem',
                position: 'relative',
                top: '4px',
              }}
            >
              Roll Call
            </Typography>
          </Link>

          {/* Page Navigation Buttons */}
          <Box sx={{ flexGrow: 1, display: 'flex' , ml: 7}}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.path}
                sx={{ 
                    my: 2, 
                    ml: 5,
                    color: 'black', 
                    display: 'block', 
                    textTransform: 'none',
                    fontSize: '1.0rem',
                    top: '4px',
                    fontWeight: location.pathname === page.path ? 'bold' : 'normal',
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {/* User Avatar and Settings Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Logout + Google Calendar">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, }}>
                <Avatar alt="User Avatar" src={profilePic} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting === 'Logout') {
                      handleLogout(); // Call the logout function
                    } else if (setting === 'Google Calendar') {
                      window.open('https://calendar.google.com', '_blank', 'noopener,noreferrer'); // Open Google Calendar in a new tab
                    }
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;