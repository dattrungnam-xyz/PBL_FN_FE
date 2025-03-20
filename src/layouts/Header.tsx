import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import {
  Avatar,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Toolbar,
  Typography,
  Box,
  Badge,
  IconButton,
} from "@mui/material";
import { ArrowDropDown, ArrowLeft, Logout, Person, ShoppingCart } from "@mui/icons-material";
import { AppDispatch, RootState } from "../stores";
import { AuthState, authActions } from "../stores/authSlice";
import { canAccessAdminPage } from "../types/auth";
import AdminIcon from "../components/UI/AdminIcon";
import SearchBar from "../components/SearchBar";

// import CustomNavLink from "../UI/NavLink";
import Logo from "../assets/logos/logo.jpg";
import DefaultAvatar from "../assets/avatars/default.svg";
// import { authActions, AuthState } from "../../stores/authSlice";
// import PinIcon from "../UI/PinIcon";
// import AdminIcon from "../UI/AdminIcon";
// import { canAccessAdminPage } from "../../types/auth";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Toolbar
        sx={{
          px: { md: 2, sm: 1 },
          justifyContent: "space-between",
          maxWidth: "1300px",
          width: "100%",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img style={{ height: "40px", width: "auto" }} src={Logo} />
          </Link>
        </Stack>

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", px: 2 }}>
          <SearchBar />
        </Box>

        {isAuthenticated ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            color="secondary.main"
          >
            <Link to="/cart">
              <IconButton size="small" sx={{ color: 'text.primary' }}>
                <Badge badgeContent={2} color="primary">
                  <ShoppingCart sx={{ fontSize: "1.5rem" }} />
                </Badge>
              </IconButton>
            </Link>
            <Typography>{user?.name}</Typography>
            <Stack
              color="text.primary"
              direction="row"
              alignItems="center"
              sx={{ cursor: "pointer", py: 0.5 }}
              onClick={handleOpenMenu}
            >
              <Avatar src={user?.avatar || DefaultAvatar} />
              {open ? <ArrowDropDown /> : <ArrowLeft />}
            </Stack>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                width: 240,
                maxWidth: "100%",
                "& .MuiMenu-list > ul:focus-visible": { outline: "none" },
              }}
            >
              <MenuList
                sx={{ "& a": { textDecoration: "none", color: "inherit" } }}
              >
                <Link to="/profile">
                  <MenuItem>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                </Link>

                {user && canAccessAdminPage(user) && (
                  <Link to="/admin">
                    <MenuItem>
                      <ListItemIcon>
                        <AdminIcon sx={{ fontSize: "20px" }} />
                      </ListItemIcon>
                      <ListItemText>Admin Dashboard</ListItemText>
                    </MenuItem>
                  </Link>
                )}

                <Divider sx={{ margin: "8px !important" }} />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              sx={{
                color: "text.primary",
                "&:hover": { color: "primary.main" },
              }}
              onClick={() => navigate("/account/register")}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              sx={{ px: "20px" }}
              onClick={() => navigate("/account/login")}
            >
              Log In
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
