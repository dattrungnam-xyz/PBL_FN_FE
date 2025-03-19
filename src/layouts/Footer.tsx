import { Box, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1300px",
          px: { md: 2, xs: 1 },
          py: 4,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            flexWrap: "wrap",
            gap: 4,
            display: "grid",
            gridTemplateColumns: {
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          {/* Company Info */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              OCOP Market
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Nền tảng thương mại điện tử kết nối người tiêu dùng với các sản
              phẩm OCOP chất lượng cao từ các địa phương.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#" color="text.secondary" underline="none">
                Về chúng tôi
              </Link>
              <Link href="#" color="text.secondary" underline="none">
                Sản phẩm OCOP
              </Link>
              <Link href="#" color="text.secondary" underline="none">
                Tin tức
              </Link>
              <Link href="#" color="text.secondary" underline="none">
                Liên hệ
              </Link>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Thông tin liên hệ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                123 Đường ABC, Quận 1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                TP. Hồ Chí Minh
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: contact@ocopmarket.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ĐT: (84) 123 456 789
              </Typography>
            </Box>
          </Box>

          {/* Social Media */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Kết nối với chúng tôi
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} OCOP Market. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
