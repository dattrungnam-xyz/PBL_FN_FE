import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  soldCount: number;
}

const ProductCard = ({
  image,
  name,
  price,
  rating,
  location,
  soldCount,
}: ProductCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
        maxWidth: 240,
        position: "relative",
      }}
    >
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
            mb: 0.5,
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

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ mt: "auto" }}
        >
          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ color: "#FFB400" }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">
              {soldCount?.toLocaleString("vi-VN")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
