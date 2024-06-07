import React, { useContext, useEffect, useState } from "react";
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
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

const getInitials = (name) => {
  return name[0].toUpperCase();
};

const Layout = ({ children }) => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("Blogs");
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedInLocal] = useState(false);
  const [initials, setInitials] = useState("");
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
    setIsLoggedInLocal(false);
    navigate("/v1/login");
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");

    if (loggedIn === "true" && token) {
      setIsLoggedInLocal(true);
      const decodedToken = jwtDecode(token);
      const username = decodedToken.existingUser.user.username;
      setInitials(getInitials(username));
    } else {
      setIsLoggedInLocal(false);
    }
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setValue(0);
        setTitle("All Blogs");
        break;
      case "/v1/myblogs":
        setValue(1);
        setTitle("My Blogs");
        break;
      case "/v1/addblog":
        setValue(2);
        setTitle("Add Blog");
        break;
      case "/v1/edit":
        setValue(3);
        setTitle("Edit Blog");
        break;
      case "/v1/login":
        setValue(4);
        setTitle("Login");
        break;
      default:
        setValue(false);
        setTitle("Blogs");
    }
  }, [location.pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {isLoggedIn && (
            <Box display="flex" marginLeft="auto" marginRight="auto">
              <Tabs
                textColor="inherit"
                value={value}
                onChange={(e, val) => setValue(val)}
              >
                <Tab LinkComponent={Link} to="/" label="All Blogs" />
                <Tab LinkComponent={Link} to="/v1/myblogs" label="My Blogs" />
                <Tab LinkComponent={Link} to="/v1/addblog" label="Add Blog" />
              </Tabs>
            </Box>
          )}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenu}
            color="inherit"
          >
            {isLoggedIn ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                {initials}
              </div>
            ) : (
              <AccountCircle />
            )}
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
            {!isLoggedIn && (
              <MenuItem onClick={() => navigate("/v1/login")}>Login</MenuItem>
            )}
            {isLoggedIn && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ paddingTop: "64px" }}>{children}</Box>
    </Box>
  );
};

export default Layout;
