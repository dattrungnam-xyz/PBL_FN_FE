import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import LoginImg from "../assets/login-img.jpg";
import RegisterImg from "../assets/register-img.jpg";

import classes from "./AuthLayout.module.scss";

import TabItem from "./TabItem";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const { pathname: activeRoute } = useLocation();

  if (localStorage.getItem("token")) {
    // Redirect to home if user is already logged in
    return <Navigate to="/" />;
  }

  const isOnLoginPage = activeRoute === "/account/login";
  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          marginTop: 3,
          maxWidth: "1100px",
        }}
      >
        <Grid container columns={10} sx={{}}>
          <Grid
            size={5}
            sx={{
              display: { xs: "none", lg: "flex" },
            }}
          >
            <img
              src={isOnLoginPage ? LoginImg : RegisterImg}
              className={classes.sideImg}
            />
          </Grid>
          <Grid
            size={{ xs: 10, lg: 5 }}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              alignSelf: { lg: "flex-start" },
              px: 4,
              py: 2,
            }}
          >
            {/* Nav */}
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ marginBottom: 1.25 }}
              >
                Welcome to OCOP Mart!
              </Typography>
              <Box className={classes.tabGroup}>
                <Link to="login">
                  <TabItem isActive={isOnLoginPage}>Login</TabItem>
                </Link>
                <Link to="register">
                  <TabItem isActive={!isOnLoginPage}>Register</TabItem>
                </Link>
              </Box>
            </Box>

            {/* form */}
            <Outlet />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AuthLayout;
