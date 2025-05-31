import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores";
import { AuthState, authActions } from "../../stores/authSlice";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
const SellerHeader = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  if (!user) return null;
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/seller");
    window.location.reload();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: 10,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 48, sm: 46 },
          px: 1,
          gap: 1,
        }}
      >
        <img
          src="/logo.png"
          alt="OCOP Mart"
          style={{ width: 48, height: 32, cursor: "pointer" }}
          onClick={() => navigate("/seller")}
        />
        <Typography
          variant="body2"
          noWrap
          component={Link}
          to="/seller"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            textDecoration: "none",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          OCOP Mart Seller Center
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Tài khoản">
            <IconButton
              onClick={handleOpenUserMenu}
              size="small"
              sx={{ p: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: theme.palette.primary.main,
                }}
                src={user?.avatar}
              >
                <AccountCircleIcon sx={{ fontSize: "1rem" }} />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{
              mt: 1,
              "& .MuiPaper-root": {
                width: 200,
                maxWidth: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              },
            }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            slotProps={{
              backdrop: {
                invisible: true,
              },
            }}
          >
            <MenuItem component={Link} to="/" sx={{ py: 0.75 }}>
              <HomeIcon sx={{ fontSize: "1rem", mr: 1 }} />
              <Typography variant="caption">Trang chủ</Typography>
            </MenuItem>
            <MenuItem component={Link} to="/seller" sx={{ py: 0.75 }}>
              <HomeIcon sx={{ fontSize: "1rem", mr: 1 }} />
              <Typography variant="caption">Trang người bán</Typography>
            </MenuItem>
            <MenuItem
              component={Link}
              to={`/store/${user.storeId}`}
              sx={{ py: 0.75 }}
            >
              <HomeIcon sx={{ fontSize: "1rem", mr: 1 }} />
              <Typography variant="caption">Cửa hàng</Typography>
            </MenuItem>
            <MenuItem component={Link} to="/profile" sx={{ py: 0.75 }}>
              <AccountCircleIcon sx={{ fontSize: "1rem", mr: 1 }} />
              <Typography variant="caption">Thông tin tài khoản</Typography>
            </MenuItem>
            <MenuItem sx={{ py: 0.75 }} onClick={handleLogout}>
              <LogoutIcon sx={{ fontSize: "1rem", mr: 1 }} />
              <Typography variant="caption">Đăng xuất</Typography>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default SellerHeader;
