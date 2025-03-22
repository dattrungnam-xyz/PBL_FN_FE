import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  alpha,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Link } from "react-router-dom";

const ProvideStoreInform = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F8FFF8 0%, #E8F5E9 100%)",
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
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 1.5,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #66BB6A 0%, #43A047 100%)",
            },
          }}
        >
          {/* Logo OCOP */}
          <Box
            component="img"
            src="/logo.png"
            alt="OCOP Logo"
            sx={{
              width: 100,
              height: 'auto',
              mb: 1.5,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
            }}
          />

          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: "12px",
              bgcolor: "primary.lighter",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 1.5,
              transform: "rotate(-10deg)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <StoreIcon
              sx={{
                fontSize: 24,
                color: "primary.main",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Thiết lập cửa hàng của bạn
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 1.5,
              maxWidth: 300,
              mx: "auto",
              fontSize: "0.85rem",
            }}
          >
            Để bắt đầu bán hàng trên OCOP, bạn cần cung cấp một số thông tin cơ
            bản về cửa hàng của mình.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              mb: 1,
              px: 0.5,
            }}
          >
            {[
              {
                icon: (
                  <ShoppingBagIcon
                    sx={{ fontSize: 20, color: "primary.main" }}
                  />
                ),
                title: "Thông tin cửa hàng",
              },
              {
                icon: (
                  <LocalShippingIcon
                    sx={{ fontSize: 20, color: "primary.main" }}
                  />
                ),
                title: "Địa chỉ giao hàng",
              },
              {
                icon: (
                  <VerifiedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                ),
                title: "Chứng nhận OCOP",
              },
            ].map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 0.75,
                  flex: 1,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  },
                }}
              >
                {item.icon}
                <Typography
                  variant="body1"
                  display="block"
                  sx={{ mt: 0.5, fontWeight: 500, fontSize: "0.7rem" }}
                >
                  {item.title}
                </Typography>
              </Paper>
            ))}
          </Stack>

          <Box
            sx={{
              p: 0.75,
              borderRadius: 1.5,
              bgcolor: alpha("#4CAF50", 0.04),
              border: "1px dashed",
              borderColor: "primary.main",
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              color="primary"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            >
              Lợi ích khi đăng ký bán hàng
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 0.5 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                • Tiếp cận hàng triệu khách hàng tiềm năng
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                • Công cụ quản lý bán hàng chuyên nghiệp
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                • Hỗ trợ vận chuyển toàn quốc
              </Typography>
            </Stack>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="center"
            sx={{ mt: 1.5 }}
          >
            <Button
              component={Link}
              to="/seller/store/create"
              variant="contained"
              size="medium"
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(76, 175, 80, 0.3)",
                },
              }}
            >
              Thiết lập ngay
            </Button>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              size="medium"
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.8rem",
              }}
            >
              Quay lại trang chủ
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProvideStoreInform;
