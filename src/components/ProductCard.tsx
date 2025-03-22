import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Stack,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

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
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
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
        sx={{ 
          objectFit: "cover",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          }
        }}
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
            gap: 0.5,
          }}
        >
          <PlaceOutlinedIcon 
            sx={{ 
              fontSize: 18,
              color: "primary.light"
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
          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            icon={<StarIcon sx={{ color: "#FFB400" }} />}
            emptyIcon={<StarBorderIcon sx={{ color: "#FFB400" }} />}
            sx={{ 
              "& .MuiRating-iconFilled": {
                filter: "drop-shadow(0px 1px 2px rgba(255, 180, 0, 0.3))"
              }
            }}
          />

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
                color: "primary.light"
              }} 
            />
            <Typography 
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500
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
