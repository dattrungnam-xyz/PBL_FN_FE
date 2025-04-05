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
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/product.service";
import { Content } from "../../layouts";
import { IProduct } from "../../interface";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductCard from "../../components/ProductCard";
import { getCategoryText } from "../../utils";
import { addToCart } from "../../services/cart.service";
import { toast } from "react-toastify";
interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newValue = prev + delta;
      return Math.max(1, Math.min(newValue, productData?.quantity || 1));
    });
  };

  const handleAddToCart = async () => {
    try {
      if (!productData?.id) {
        throw new Error("Product ID is required");
      }
      await addToCart(productData.id, quantity);
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Content>
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      </Content>
    );
  }

  if (error || !productData) {
    return (
      <Content>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">
            {error instanceof Error ? error.message : "Không tìm thấy sản phẩm"}
          </Typography>
        </Box>
      </Content>
    );
  }

  return (
    <Content>
      <Box sx={{ py: { xs: 1, sm: 1.5, md: 2 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 0.5, sm: 1 },
          }}
        >
          {/* Main Product Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0.5, sm: 1.5 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 2 },
              border: 1,
              borderColor: "divider",
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {/* Left Column - Image Gallery */}
              <Box>
                {/* Main Image */}
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 250, sm: 300, md: 400 },
                    mb: { xs: 1, sm: 1.5 },
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: 1,
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
                  {productData.images.map((image: string, index: number) => (
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
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                    mb: { xs: 1, sm: 1.5 },
                    fontWeight: 600,
                  }}
                >
                  {productData.name}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: { xs: 1, sm: 1.5 } }}
                >
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                      fontWeight: 600,
                    }}
                  >
                    {productData?.price?.toLocaleString()}đ
                  </Typography>
                  {/* <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      textDecoration: "line-through",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    {productData.price?.toLocaleString()}đ
                  </Typography> */}
                </Stack>

                {/* Rating and Reviews */}
                {/* <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: { xs: 1, sm: 1.5 } }}
                >
                  <Rating
                    value={productData.star}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    ({productData.reviewCount || 0} đánh giá)
                  </Typography>
                </Stack> */}

                {/* Location */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: { xs: 1, sm: 1.5 } }}
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
                    {productData?.seller?.provinceName}
                  </Typography>
                </Stack>

                <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />

                {/* Category */}
                <Chip
                  label={getCategoryText(productData.category)}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                />

                {/* Quantity Selector */}
                <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      mb: { xs: 0.5, sm: 1 },
                      fontWeight: 500,
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
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      size="small"
                      slotProps={{ input: { readOnly: false } }}
                      sx={{
                        width: { xs: 50, sm: 60 },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= productData.quantity}
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                    >
                      <AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Còn {productData.quantity} sản phẩm
                    </Typography>
                  </Stack>
                </Box>

                {/* Action Buttons */}
                <Stack
                  direction="row"
                  spacing={{ xs: 0.5, sm: 1.5 }}
                  sx={{ mb: { xs: 0.5, sm: 1 } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{
                      flex: 1,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: 500,
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <IconButton
                    size="large"
                    onClick={() => setIsFavorite(!isFavorite)}
                    color={isFavorite ? "error" : "default"}
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ fontSize: { xs: 18, sm: 24 } }}
                      />
                    )}
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Paper>

          {/* Store Information Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0.5, sm: 1 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 2 },
              border: 1,
              borderColor: "divider",
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            <Box
              onClick={() => setShowStoreDetails(!showStoreDetails)}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: showStoreDetails ? { xs: 0.5, sm: 1 } : 0,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={productData.seller?.avatar}
                  alt={productData.seller?.name}
                  sx={{
                    width: { xs: 40, sm: 50 },
                    height: { xs: 40, sm: 50 },
                    border: 1,
                    borderColor: "primary.main",
                  }}
                />
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontWeight: 600,
                      }}
                    >
                      {productData.seller?.name}
                    </Typography>
                  </Stack>
                  {/* <Stack direction="row" spacing={1} alignItems="center">
                    <Rating
                      value={productData.store.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      ({productData.store.reviewCount} đánh giá)
                    </Typography>
                  </Stack> */}
                </Box>
              </Stack>
              {showStoreDetails ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </Box>

            {showStoreDetails && (
              <>
                <Divider sx={{ my: { xs: 0.5, sm: 1 } }} />
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon
                      sx={{
                        fontSize: { xs: 16, sm: 18 },
                        color: "text.secondary",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {productData.seller?.phone}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon
                      sx={{
                        fontSize: { xs: 16, sm: 18 },
                        color: "text.secondary",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {productData.seller?.address}
                      {", "}
                      {productData.seller?.wardName}
                      {", "}
                      {productData.seller?.districtName}
                      {", "}
                      {productData.seller?.provinceName}
                    </Typography>
                  </Stack>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  Xem thêm sản phẩm của cửa hàng
                </Button>
              </>
            )}
          </Paper>

          {/* Product Tabs Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0.5, sm: 1 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 2 },
              border: 1,
              borderColor: "divider",
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: { xs: 0.5, sm: 1 },
                "& .MuiTab-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  textTransform: "none",
                  fontWeight: 500,
                },
              }}
            >
              <Tab label="Mô tả sản phẩm" />
              <Tab label={`Đánh giá (${productData.reviews?.length || 0})`} />
            </Tabs>

            {activeTab === 0 && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  whiteSpace: "pre-line",
                  lineHeight: 1.6,
                }}
              >
                {productData.description}
              </Typography>
            )}

            {activeTab === 1 && (
              <Stack spacing={3}>
                {productData.reviews?.map((review) => (
                  <Box key={review.id}>
                    {/* <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Avatar
                        src={review.user.avatar}
                        alt={review.user.name}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {review.user.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating
                            value={review.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {new Date(review.date).toLocaleDateString("vi-VN")}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack> */}
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      {review.comment}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Related Products Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0.5, sm: 1 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 2 },
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                mb: { xs: 1, sm: 2 },
                fontWeight: 600,
              }}
            >
              Sản phẩm liên quan
            </Typography>
            {/* <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(auto-fill, minmax(200px, 1fr))",
                  sm: "repeat(auto-fill, minmax(250px, 1fr))",
                },
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              {productData.relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  location={productData.location}
                />
              ))}
            </Box> */}
          </Paper>
        </Box>
      </Box>
    </Content>
  );
};

export default Product;
