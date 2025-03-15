import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import SideBar from "./SideBar";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
// import HeaderAdmin from "./HeaderAdmin";
import { Outlet } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { authActions, AuthState } from "../../../stores/authSlice";
import DefaultAvatar from "../../../assets/avatars/default.svg";
import { Logout } from "@mui/icons-material";
import Link from "../../UI/Link";

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          height: "100vh !important",
          background: "#f0f0f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SideBar collapsed={collapsed} />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Link to="/profile">
              <Avatar
                src={user?.avatar || DefaultAvatar}
                sx={{ display: "inline-block", width: "50px", height: "50px" }}
              />
            </Link>
            <Typography sx={{ marginBottom: 1, marginTop: 0.25 }}>
              {collapsed ? " " : user?.name || user?.username}
            </Typography>

            <Button
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{
                color: "secondary.main",
                "& .MuiButton-icon": {
                  marginRight: collapsed ? 0 : "8px",
                },
              }}
            >
              {!collapsed && "Logout"}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
        }}
      >
        <Stack>
          <Box
            sx={{
              height: "50px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <FaBars onClick={() => setCollapsed(!collapsed)} />
          </Box>
          <Box
            sx={{
              height: "calc(100vh - 55px)",
            }}
          >
            <PerfectScrollbar>
              <Outlet />
            </PerfectScrollbar>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Admin;
