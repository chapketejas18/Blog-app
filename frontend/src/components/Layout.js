import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children, setIsLoggedIn }) => {
  const [value, setValue] = useState();
  const [title, setTitle] = useState("Blogs");
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedInLocal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedInLocal(loggedIn === "true");
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/blogs":
        setValue(0);
        setTitle("All Blogs");
        break;
      case "/myblogs":
        setValue(1);
        setTitle("My Blogs");
        break;
      case "/addblog":
        setValue(2);
        setTitle("Add Blog");
        break;
      case "/edit":
        setValue(3);
        setTitle("Edit Blog");
        break;
      default:
        setValue(false);
        setTitle("Blogs");
    }
  }, [location.pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Box display="flex" marginLeft="auto" marginRight="auto">
            <Tabs
              textColor="inherit"
              value={value}
              onChange={(e, val) => setValue(val)}
            >
              <Tab LinkComponent={Link} to="/blogs" label="All Blogs" />
              <Tab LinkComponent={Link} to="/myblogs" label="My Blogs" />
              <Tab LinkComponent={Link} to="/addblog" label="Add Blog" />
            </Tabs>
          </Box>
          {isLoggedIn && (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={profileAnchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};

export default Layout;
