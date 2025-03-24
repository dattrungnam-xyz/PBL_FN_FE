import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SellerHeader from "./SellerHeader";
import SellerSidebar from "./SellerSidebar";
import { RootState } from "../../stores";
import { AuthState } from "../../stores/authSlice";

const SellerLayout = () => {
  const { isAuthenticated } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );

  if (!isAuthenticated) {
    toast.error("Bạn cần đăng nhập để truy cập vào trang này");
    return <Navigate to="/" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        bgcolor: "#F8FFF8", // Light green background
      }}
    >
      <SellerHeader />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          background: "linear-gradient(135deg, #F8FFF8 0%, #E8F5E9 100%)", // Subtle green gradient
        }}
      >
        <SellerSidebar />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            bgcolor: "transparent",
            maxHeight: "calc(100vh - 46px)",
            px: 3,
            py: 3,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234CAF50' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: 0.4,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              bgcolor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 2,
              p: 1,
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerLayout;
