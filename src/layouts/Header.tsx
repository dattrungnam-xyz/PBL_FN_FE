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
  IconButton,
} from "@mui/material";
import {
  ArrowDropDown,
  ArrowLeft,
  Logout,
  Person,
  ShoppingCart,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "../stores";
import { AuthState, authActions } from "../stores/authSlice";
import { canAccessAdminPage, isAdmin, isSeller } from "../types/auth";
import AdminIcon from "../components/UI/AdminIcon";
import SearchBar from "../components/SearchBar";
import InventoryIcon from "@mui/icons-material/Inventory";

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
              <IconButton size="small" sx={{ color: "text.primary" }}>
                <ShoppingCart sx={{ fontSize: "1.5rem" }} />
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
                    <ListItemText>Trang cá nhân</ListItemText>
                  </MenuItem>
                </Link>

                {user && canAccessAdminPage(user) && (
                  <Link to="/admin">
                    <MenuItem>
                      <ListItemIcon>
                        <AdminIcon sx={{ fontSize: "20px" }} />
                      </ListItemIcon>
                      <ListItemText>Trang quản trị</ListItemText>
                    </MenuItem>
                  </Link>
                )}

                {user && !isAdmin(user) ? (
                  isSeller(user) ? (
                    <Link to="/seller">
                      <MenuItem>
                        <ListItemText>Quản lý cửa hàng</ListItemText>
                      </MenuItem>
                    </Link>
                  ) : (
                    <>
                      <Link to="/seller">
                        <MenuItem>
                          <ListItemIcon>
                            <AdminIcon sx={{ fontSize: "20px" }} />
                          </ListItemIcon>
                          <ListItemText>
                            {user.storeId
                              ? "Quản lý cửa hàng"
                              : "Đăng kí bán hàng"}
                          </ListItemText>
                        </MenuItem>
                      </Link>
                      <Link to="/orders">
                        <MenuItem>
                          <ListItemIcon>
                            <InventoryIcon sx={{ fontSize: "20px" }} />
                          </ListItemIcon>
                          <ListItemText>Đơn hàng của tôi</ListItemText>
                        </MenuItem>
                      </Link>
                    </>
                  )
                ) : null}

                <Divider sx={{ margin: "8px !important" }} />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Đăng xuất</ListItemText>
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
              Đăng kí
            </Button>
            <Button
              variant="contained"
              sx={{ px: "20px" }}
              onClick={() => navigate("/account/login")}
            >
              Đăng nhập
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
