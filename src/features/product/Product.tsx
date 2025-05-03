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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/product.service";
import { Content } from "../../layouts";
import { IProduct } from "../../interface";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PhoneIcon from "@mui/icons-material/Phone";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getCategoryText } from "../../utils";
import { addToCart } from "../../services/cart.service";
import { toast } from "react-toastify";
import ImageDetail from "../../components/ImageDetail";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { deleteReview } from "../../services/review.service";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { OrderStatus, VerifyOCOPStatus } from "../../enums";
import ProductCard from "../../components/ProductCard";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const { data: relatedProducts } = useQuery<IProduct[]>({
    queryKey: ["relatedProducts", id],
    queryFn: () => getRelatedProducts(id!),
    enabled: !!id,
  });

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newValue = prev + delta;
      return Math.max(1, Math.min(newValue, productData?.quantity || 1));
    });
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      toast.success("Đã xóa đánh giá thành công");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  useEffect(() => {
    const viewHistory = localStorage.getItem("viewHistory");
    const viewHistoryArray = JSON.parse(viewHistory || "[]") || [];
    if (productData && !viewHistoryArray.includes(productData.id)) {
      const payload = [...viewHistoryArray, productData.id];
      while (payload.length > 10) {
        payload.shift();
      }
      localStorage.setItem("viewHistory", JSON.stringify(payload));
    }
  }, [productData]);

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
      <Box sx={{ py: { xs: 0.5, sm: 1 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 0.5, sm: 0.75 },
          }}
        >
          {/* Main Product Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0.5, sm: 1 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 1.5 },
              border: 1,
              borderColor: "divider",
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {/* Left Column - Image Gallery */}
              <Box>
                {/* Main Image */}
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 250, md: 350 },
                    mb: { xs: 0.75, sm: 1 },
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: 1,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setSelectedMedia(productData.images[selectedImage])
                  }
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
                    gap: { xs: 0.5, sm: 0.75 },
                    overflowX: "auto",
                    pb: 0.75,
                    "&::-webkit-scrollbar": {
                      height: 4,
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: "background.default",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "divider",
                      borderRadius: 2,
                    },
                  }}
                >
                  {productData.images.map((image: string, index: number) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: { xs: 50, sm: 60 },
                        height: { xs: 50, sm: 60 },
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
                    fontSize: { xs: "0.875rem", sm: "1.25rem", md: "1.5rem" },
                    mb: { xs: 0.75, sm: 1 },
                    fontWeight: 600,
                  }}
                >
                  {productData.name}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{ mb: { xs: 0.75, sm: 1 } }}
                >
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                      fontWeight: 600,
                    }}
                  >
                    {productData?.price?.toLocaleString()}đ
                  </Typography>
                </Stack>

                {/* Location */}
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{ mb: { xs: 0.75, sm: 1 } }}
                >
                  <LocationOnIcon
                    color="action"
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {productData?.seller?.provinceName}
                  </Typography>
                </Stack>

                <Divider sx={{ my: { xs: 0.75, sm: 1 } }} />

                {/* Category */}
                <Chip
                  label={getCategoryText(productData.category)}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: { xs: 0.75, sm: 1 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                />

                {/* Quantity Selector */}
                <Box sx={{ mb: { xs: 0.75, sm: 1 } }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "0.875rem" },
                      mb: { xs: 0.5, sm: 0.75 },
                      fontWeight: 500,
                    }}
                  >
                    Số lượng
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      sx={{ p: { xs: 0.5, sm: 0.75 } }}
                    >
                      <RemoveIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      size="small"
                      slotProps={{ input: { readOnly: false } }}
                      sx={{
                        width: { xs: 40, sm: 50 },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= productData.quantity}
                      sx={{ p: { xs: 0.5, sm: 0.75 } }}
                    >
                      <AddIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
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
                  spacing={{ xs: 0.5, sm: 1 }}
                  sx={{ mb: { xs: 0.5, sm: 0.75 } }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{
                      flex: 1,
                      fontSize: { xs: "0.875rem", sm: "0.875rem" },
                      fontWeight: 500,
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => setIsFavorite(!isFavorite)}
                    color={isFavorite ? "error" : "default"}
                    sx={{ p: { xs: 0.5, sm: 0.75 } }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ fontSize: { xs: 16, sm: 20 } }}
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
              p: { xs: 0.5, sm: 0.75 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 1.5 },
              border: 1,
              borderColor: "divider",
              mb: { xs: 0.5, sm: 0.75 },
            }}
          >
            <Box
              onClick={() => setShowStoreDetails(!showStoreDetails)}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: showStoreDetails ? { xs: 0.5, sm: 0.75 } : 0,
              }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Avatar
                  src={productData.seller?.avatar}
                  alt={productData.seller?.name}
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    border: 1,
                    borderColor: "primary.main",
                  }}
                />
                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        fontWeight: 600,
                      }}
                    >
                      {productData.seller?.name}
                    </Typography>
                  </Stack>
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
                <Divider sx={{ my: { xs: 0.5, sm: 0.75 } }} />
                <Stack spacing={1}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <PhoneIcon
                      sx={{
                        fontSize: { xs: 16, sm: 16 },
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
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <LocationOnIcon
                      sx={{
                        fontSize: { xs: 16, sm: 16 },
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
                    mt: { xs: 1, sm: 1.5 },
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
              p: { xs: 0.5, sm: 0.75 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 1.5 },
              border: 1,
              borderColor: "divider",
              mb: { xs: 0.5, sm: 0.75 },
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: { xs: 0.5, sm: 0.75 },
                "& .MuiTab-root": {
                  fontSize: { xs: "0.875rem", sm: "0.875rem" },
                  textTransform: "none",
                  fontWeight: 500,
                },
              }}
            >
              <Tab label="Mô tả sản phẩm" />
              <Tab label={`Đánh giá (${productData.reviews?.length || 0})`} />
              {productData.verifyOcopStatus === VerifyOCOPStatus.VERIFIED && (
                <Tab label="Xác thực OCOP" />
              )}
            </Tabs>

            {activeTab === 0 && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "0.875rem" },
                  whiteSpace: "pre-line",
                  lineHeight: 1.6,
                }}
              >
                {productData.description}
              </Typography>
            )}

            {activeTab === 1 && (
              <Box
                sx={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "divider",
                    borderRadius: "2px",
                  },
                }}
              >
                <Stack spacing={0.5}>
                  {productData.reviews?.map((review) => (
                    <Box
                      key={review.id}
                      sx={{
                        p: 0.75,
                        borderRadius: 1,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        position: "relative",
                      }}
                    >
                      <Stack spacing={0.5}>
                        {/* Header */}
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="flex-start"
                        >
                          <Avatar
                            src={review.user.avatar}
                            alt={review.user.name}
                            sx={{
                              width: 40,
                              height: 40,
                              border: 1,
                              borderColor: "divider",
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                              >
                                {review.user.name}
                              </Typography>
                              {review.user.id === currentUser?.id && (
                                <Chip
                                  label="Bạn"
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                            {review.orderDetail && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {review.orderDetail.product.name} - số lượng{" "}
                                {review.orderDetail.quantity}
                              </Typography>
                            )}
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                            >
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
                                {new Date(review.createdAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </Typography>
                            </Stack>
                          </Box>
                          {review.user.id === currentUser?.id && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteReview(review.id)}
                              sx={{ mt: -0.5 }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Stack>

                        {/* Content */}
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: "pre-line",
                            lineHeight: 1.6,
                            fontSize: "0.875rem",
                          }}
                        >
                          {review.description}
                        </Typography>

                        {/* Media */}
                        {review.media && review.media.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.75,
                              flexWrap: "wrap",
                            }}
                          >
                            {review.media.map((mediaUrl, index) => {
                              const isImage = mediaUrl.match(
                                /\.(jpg|jpeg|png|gif|webp)$/i,
                              );
                              return (
                                <Box
                                  key={index}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    cursor: "pointer",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    border: 1,
                                    borderColor: "divider",
                                    "&:hover": {
                                      borderColor: "primary.main",
                                    },
                                  }}
                                  onClick={() => setSelectedMedia(mediaUrl)}
                                >
                                  {isImage ? (
                                    <img
                                      src={mediaUrl}
                                      alt={`Review media ${index + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <video
                                      src={mediaUrl}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {activeTab === 2 &&
              productData.verifyOcopStatus === VerifyOCOPStatus.VERIFIED && (
                <Box>
                  {(() => {
                    const latestVerify = productData.verify
                      ?.filter(
                        (ver) => ver.status === VerifyOCOPStatus.VERIFIED,
                      )
                      ?.sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      )[0];

                    if (!latestVerify) return null;

                    return (
                      <Stack spacing={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {latestVerify.productName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Cơ sở sản xuất: {latestVerify.manufacturer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Xác thực ngày:{" "}
                              {format(
                                new Date(latestVerify.createdAt),
                                "dd/MM/yyyy",
                                { locale: vi },
                              )}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Đánh giá OCOP
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Rating
                              value={latestVerify.star}
                              readOnly
                              precision={0.5}
                              size="large"
                            />
                            <Typography variant="h6" color="primary">
                              {latestVerify.star} sao
                            </Typography>
                          </Stack>
                        </Box>

                        {latestVerify.images &&
                          latestVerify.images.length > 0 && (
                            <Box>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                Hình ảnh chứng nhận
                              </Typography>
                              <Box
                                display="flex"
                                flexWrap="wrap"
                                gap={1}
                                sx={{
                                  "& img": {
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    border: "2px solid",
                                    borderColor: "divider",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      borderColor: "primary.main",
                                      boxShadow: (theme) =>
                                        `0 0 0 2px ${theme.palette.primary.main}`,
                                    },
                                  },
                                }}
                              >
                                {latestVerify.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Chứng nhận ${index + 1}`}
                                    onClick={() => setSelectedMedia(image)}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                      </Stack>
                    );
                  })()}
                </Box>
              )}
          </Paper>

          {selectedMedia && (
            <ImageDetail
              open={!!selectedMedia}
              onClose={() => setSelectedMedia(null)}
              currentMedia={selectedMedia}
              mediaList={
                productData.reviews?.flatMap((review) => review.media || []) ||
                []
              }
              onNext={() => {
                const currentIndex = (
                  productData.reviews?.flatMap(
                    (review) => review.media || [],
                  ) || []
                ).findIndex((m) => m === selectedMedia);
                const nextIndex =
                  (currentIndex + 1) %
                  (
                    productData.reviews?.flatMap(
                      (review) => review.media || [],
                    ) || []
                  ).length;
                setSelectedMedia(
                  (productData.reviews?.flatMap(
                    (review) => review.media || [],
                  ) || [])[nextIndex],
                );
              }}
              onPrev={() => {
                const currentIndex = (
                  productData.reviews?.flatMap(
                    (review) => review.media || [],
                  ) || []
                ).findIndex((m) => m === selectedMedia);
                const prevIndex =
                  (currentIndex -
                    1 +
                    (
                      productData.reviews?.flatMap(
                        (review) => review.media || [],
                      ) || []
                    ).length) %
                  (
                    productData.reviews?.flatMap(
                      (review) => review.media || [],
                    ) || []
                  ).length;
                setSelectedMedia(
                  (productData.reviews?.flatMap(
                    (review) => review.media || [],
                  ) || [])[prevIndex],
                );
              }}
            />
          )}

          {/* Related Products Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0.5, sm: 0.75 },
              bgcolor: "background.paper",
              borderRadius: { xs: 1, sm: 1.5 },
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                mb: { xs: 0.75, sm: 1.5 },
                fontWeight: 600,
              }}
            >
              Sản phẩm liên quan
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, p: 1 }}>
              {relatedProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.images[0]}
                  name={product.name}
                  price={product.price}
                  rating={
                    product.reviews?.reduce(
                      (acc, curr) => acc + curr.rating,
                      0,
                    ) / (product.reviews?.length || 1)
                  }
                  location={product.seller.provinceName}
                  soldCount={product?.orderDetails.reduce(
                    (acc, curr) =>
                      acc +
                      (curr.order.orderStatus !== OrderStatus.REFUNDED &&
                      curr.order.orderStatus !== OrderStatus.CANCELLED &&
                      curr.order.orderStatus !== OrderStatus.REJECTED
                        ? curr.quantity
                        : 0),
                    0,
                  )}
                  isVerified={
                    product.verifyOcopStatus === VerifyOCOPStatus.VERIFIED
                  }
                  id={product.id}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Content>
  );
};

export default Product;
