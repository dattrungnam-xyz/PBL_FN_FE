import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Stack,
  Tooltip,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VerifiedIcon from "@mui/icons-material/Verified";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  soldCount: number;
  isVerified?: boolean;
}

const ProductCard = ({
  image,
  name,
  price,
  rating,
  location,
  soldCount,
  isVerified = false,
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
          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            icon={<StarIcon sx={{ color: "#FFB400" }} />}
            emptyIcon={<StarBorderIcon sx={{ color: "#FFB400" }} />}
            sx={{
              "& .MuiRating-iconFilled": {
                filter: "drop-shadow(0px 1px 2px rgba(255, 180, 0, 0.3))",
              },
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
