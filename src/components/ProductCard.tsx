import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  rating?: number;
  ocopRating?: number;
  location: string;
  soldCount: number;
  isVerified?: boolean;
  id?: string;
}

const ProductCard = ({
  id,
  image,
  name,
  price,
  rating = 0,
  ocopRating = 0,
  location,
  soldCount,
  isVerified = false,
}: ProductCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        },
        maxWidth: 240,
        position: "relative",
      }}
      onClick={() => {
        navigate(`/product/${id}`);
      }}
    >
      {isVerified && (
        <Tooltip title="Đã xác thực OCOP" placement="top">
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              padding: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <VerifiedIcon
              sx={{
                color: "primary.main",
                fontSize: 24,
              }}
            />
          </Box>
        </Tooltip>
      )}
      <CardMedia
        component="img"
        height="160"
        image={image}
        alt={name}
        sx={{
          objectFit: "cover",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.01)",
          },
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            height: 24,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "1rem",
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="h6"
          color="primary"
          sx={{
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          {price.toLocaleString("vi-VN")}đ
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            mb: 0.5,
            gap: 0.5,
          }}
        >
          <PlaceOutlinedIcon
            sx={{
              fontSize: 18,
              color: "primary.light",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {location}
          </Typography>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ mt: "auto" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Đánh giá khách hàng">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarIcon sx={{ color: "#FFB400", fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {rating}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Đánh giá OCOP">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <WorkspacePremiumIcon sx={{ color: "#4CAF50", fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {ocopRating}
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              gap: 0.5,
            }}
          >
            <LocalMallOutlinedIcon
              sx={{
                fontSize: 18,
                color: "primary.light",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {soldCount?.toLocaleString("vi-VN")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
