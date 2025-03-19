import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  rating: number;
  location: string;
}

const ProductCard = ({
  image,
  name,
  price,
  rating,
  location,
}: ProductCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        maxWidth: 240,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 1,
          p: 0.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Rating
          value={rating}
          precision={0.5}
          readOnly
          size="small"
          sx={{ color: "#FFB400" }}
        />
      </Box>
      <CardMedia
        component="img"
        height="160"
        image={image}
        alt={name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, p: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
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
            mt: "auto",
          }}
        >
          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
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
      </CardContent>
    </Card>
  );
};

export default ProductCard;
