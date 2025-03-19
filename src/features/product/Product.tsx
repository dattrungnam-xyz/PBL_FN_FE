import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Divider,
  Rating,
  TextField,
  Paper,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { Content } from "../../layouts";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// Sample data - replace with actual data from API
const productData = {
  id: 1,
  name: "Sản phẩm mẫu",
  price: 150000,
  originalPrice: 200000,
  rating: 4.5,
  reviewCount: 128,
  location: "Hà Nội",
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  images: [
    "https://via.placeholder.com/600",
    "https://via.placeholder.com/600",
    "https://via.placeholder.com/600",
    "https://via.placeholder.com/600",
  ],
  category: "Thực phẩm",
  stock: 50,
};

const Product = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newValue = prev + delta;
      return Math.max(1, Math.min(newValue, productData.stock));
    });
  };

  const handleAddToCart = () => {
    // Implement add to cart logic
    console.log("Add to cart:", { productId: productData.id, quantity });
  };

  return (
    <Content>
      <Box sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 0.5, sm: 1 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0.5, sm: 1.5 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 2 },
              border: 1,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 1, sm: 2 },
              }}
            >
              {/* Left Column - Image Gallery */}
              <Box>
                {/* Main Image */}
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 250, sm: 300, md: 400 },
                    mb: { xs: 0.5, sm: 1 },
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={productData.images[selectedImage]}
                    alt={productData.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Thumbnail Gallery */}
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 0.5, sm: 1 },
                    overflowX: "auto",
                    pb: 1,
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: "background.default",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "divider",
                      borderRadius: 3,
                    },
                  }}
                >
                  {productData.images.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        borderRadius: 1,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: 2,
                        borderColor:
                          selectedImage === index
                            ? "primary.main"
                            : "transparent",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <img
                        src={image}
                        alt={`${productData.name} ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Right Column - Product Info */}
              <Box>
                {/* Product Title */}
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    mb: { xs: 1.5, sm: 2.5 },
                  }}
                >
                  {productData.name}
                </Typography>

                {/* Price */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: { xs: 0.5, sm: 1 } }}
                >
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    }}
                  >
                    {productData.price.toLocaleString()}đ
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      textDecoration: "line-through",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    {productData.originalPrice.toLocaleString()}đ
                  </Typography>
                </Stack>

                {/* Rating and Reviews */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: { xs: 0.5, sm: 1 } }}
                >
                  <Rating
                    value={productData.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    ({productData.reviewCount} đánh giá)
                  </Typography>
                </Stack>

                {/* Location */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: { xs: 0.5, sm: 1 } }}
                >
                  <LocationOnIcon
                    color="action"
                    sx={{ fontSize: { xs: 18, sm: 20 } }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {productData.location}
                  </Typography>
                </Stack>

                <Divider sx={{ my: { xs: 0.5, sm: 1 } }} />

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {productData.description}
                </Typography>

                {/* Category */}
                <Chip
                  label={productData.category}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                />

                {/* Quantity Selector */}
                <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      mb: { xs: 0.5, sm: 1 },
                    }}
                  >
                    Số lượng
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                    >
                      <RemoveIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    </IconButton>
                    <TextField
                      value={quantity}
                      size="small"
                      sx={{
                        width: { xs: 50, sm: 60 },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        },
                      }}
                      inputProps={{ readOnly: true }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= productData.stock}
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                    >
                      <AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Còn {productData.stock} sản phẩm
                    </Typography>
                  </Stack>
                </Box>

                {/* Action Buttons */}
                <Stack
                  direction="row"
                  spacing={{ xs: 0.5, sm: 1.5 }}
                  sx={{ mt: { xs: 1, sm: 2 } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{
                      flex: 1,
                      py: { xs: 0.5, sm: 1 },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <IconButton
                    size="large"
                    onClick={() => setIsFavorite(!isFavorite)}
                    color={isFavorite ? "error" : "default"}
                    sx={{ p: { xs: 1, sm: 1.5 } }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ fontSize: { xs: 24, sm: 28 } }}
                      />
                    )}
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Content>
  );
};

export default Product;
