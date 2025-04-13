import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Rating,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ButtonGroup,
  Pagination,
  LinearProgress,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Proof from "./Proof";
import { IReview, IReviewStatistic } from "../../interface";
import {
  getRecentReviews,
  getReviews,
  getReviewStatistic,
} from "../../services/review.service";
import ImageDetail from "../../components/ImageDetail";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { getProductByStoreId } from "../../services/product.service";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { AuthState } from "../../stores/authSlice";
import { Navigate } from "react-router-dom";
import { IProductTableData } from "../../interface/product.interface";
import { useDebounce } from "../../hooks/useDebounce";

const Review = () => {
  const [viewType, setViewType] = useState<"general" | "all">("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [proofOpen, setProofOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState<{
    media: { type: "image" | "video"; url: string }[];
    initialIndex: number;
  } | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedMediaList, setSelectedMediaList] = useState<string[]>([]);

  const [reviewStatistic, setReviewStatistic] = useState<IReviewStatistic>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [],
  });
  const [recentReviews, setRecentReviews] = useState<IReview[]>([]);

  const [products, setProducts] = useState<IProductTableData[]>([]);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const limit = 5;

  const searchDebounce = useDebounce(searchQuery, 1000);

  useEffect(() => {
    if (!user?.storeId) return;
    const fetchReviewStatistic = async () => {
      try {
        const response = await getReviewStatistic();
        setReviewStatistic(response);
      } catch (error) {
        console.error("Error fetching review statistic:", error);
      }
    };

    const fetchRecentReviews = async () => {
      try {
        const response = await getRecentReviews();
        setRecentReviews(response);
      } catch (error) {
        console.error("Error fetching recent reviews:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await getProductByStoreId(user?.storeId, {
          page: 1,
          limit: 1000,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchReviewStatistic();
    fetchRecentReviews();
    fetchProducts();
  }, [user?.storeId]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await getReviews({
        page: currentPage,
        limit: limit,
        productId: selectedProduct,
        rating: selectedRating ?? undefined,
        search: searchDebounce,
      });
      setAllReviews(response.data);
      setTotalReviews(response.total);
    };
    fetchReviews();
  }, [currentPage, selectedProduct, selectedRating, searchDebounce]);

  const handleCloseProof = () => {
    setProofOpen(false);
    setSelectedProof(null);
  };

  const handleMediaClick = (images: string[], index: number) => {
    setSelectedMediaList(images);
    setSelectedMedia(images[index]);
  };

  const handleNextMedia = () => {
    if (selectedMedia && selectedMediaList.length > 0) {
      const currentIndex = selectedMediaList.indexOf(selectedMedia);
      const nextIndex = (currentIndex + 1) % selectedMediaList.length;
      setSelectedMedia(selectedMediaList[nextIndex]);
    }
  };

  const handlePrevMedia = () => {
    if (selectedMedia && selectedMediaList.length > 0) {
      const currentIndex = selectedMediaList.indexOf(selectedMedia);
      const prevIndex =
        (currentIndex - 1 + selectedMediaList.length) %
        selectedMediaList.length;
      setSelectedMedia(selectedMediaList[prevIndex]);
    }
  };

  if (!user?.storeId) {
    return <Navigate to="/seller/create" />;
  }

  const renderPagination = (totalItems: number) => (
    <Stack alignItems="center" sx={{ mt: 1 }}>
      <Pagination
        count={Math.ceil(totalItems / limit)}
        page={currentPage}
        onChange={(_, value) => setCurrentPage(value)}
        size="small"
        color="primary"
      />
    </Stack>
  );

  const renderGeneralReviews = () => (
    <>
      {/* Summary Cards */}
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.25} alignItems="center">
              <Typography variant="h4" fontWeight={600}>
                {(+reviewStatistic.averageRating).toFixed(1)}
              </Typography>
              <Rating
                value={reviewStatistic.averageRating}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {reviewStatistic.totalReviews} đánh giá
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 2, minWidth: 300 }}>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              {reviewStatistic.ratingDistribution.map((dist) => {
                return (
                  <Stack key={dist.rating} spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="body2" sx={{ minWidth: 20 }}>
                        {dist.rating}
                      </Typography>
                      <Rating
                        value={dist.rating}
                        max={1}
                        readOnly
                        size="small"
                      />
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={dist.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            backgroundColor: "grey.100",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "warning.main",
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ minWidth: 40 }}>
                        {dist.count}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 40 }}
                      >
                        ({dist.percentage.toFixed(1)}%)
                      </Typography>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Recent Reviews */}
      <Card
        sx={{
          borderRadius: 0.5,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 0.25,
            }}
          >
            <RateReviewIcon fontSize="small" />
            Đánh giá gần đây
          </Typography>
          <Stack spacing={0.5}>
            {recentReviews.map((review) => (
              <Box
                key={review.id}
                sx={{
                  p: 1,
                  borderRadius: 0.5,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Stack spacing={0.5}>
                  {/* Product Info */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="flex-start"
                    sx={{
                      p: 0.5,
                      borderRadius: 0.5,
                      bgcolor: "grey.50",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 0.5,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                      }}
                    >
                      {review.product.images?.[0] ? (
                        <img
                          src={review.product.images?.[0]}
                          alt={review.product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Avatar
                          src={review.product.images?.[0]}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 0.5,
                            bgcolor: "primary.light",
                          }}
                        >
                          {review.product.name}
                        </Avatar>
                      )}
                    </Box>
                    <Stack sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary"
                      >
                        {review.product.name} x {review.orderDetail?.quantity}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Review Content */}
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Avatar
                        src={review.user.avatar}
                        sx={{
                          width: 28,
                          height: 28,
                          border: "1px solid",
                          borderColor: "primary.main",
                        }}
                      />
                      <Stack sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {review.user.name}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.25}
                          alignItems="center"
                        >
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            sx={{
                              "& .MuiRating-iconFilled": {
                                color: "warning.main",
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(review.createdAt), "dd/MM/yyyy")}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.3,
                        fontSize: "0.8125rem",
                      }}
                    >
                      {review.description}
                    </Typography>
                    {review.media && (
                      <Stack
                        direction="row"
                        spacing={0.25}
                        sx={{
                          mt: 0.5,
                          flexWrap: "wrap",
                          gap: 0.25,
                        }}
                      >
                        {review.media.map((media, index) => {
                          const isVideo =
                            media.toLowerCase().endsWith(".mp4") ||
                            media.toLowerCase().endsWith(".mov") ||
                            media.toLowerCase().endsWith(".webm");

                          return (
                            <Box
                              key={index}
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 0.5,
                                overflow: "hidden",
                                cursor: "pointer",
                                position: "relative",
                                border: "1px solid",
                                borderColor: "divider",
                                "&:hover": {
                                  borderColor: "primary.main",
                                  transform: "scale(1.02)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                              onClick={() =>
                                handleMediaClick(review.media || [], index)
                              }
                            >
                              {isVideo ? (
                                <>
                                  <video
                                    src={media}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      color: "white",
                                      bgcolor: "rgba(0,0,0,0.5)",
                                      borderRadius: "50%",
                                      p: 0.25,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <PlayArrowIcon fontSize="small" />
                                  </Box>
                                </>
                              ) : (
                                <img
                                  src={media}
                                  alt={`Review ${index + 1}`}
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
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );

  const renderAllReviews = () => {
    return (
      <Stack spacing={0.5}>
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={0.5}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm đánh giá..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Chọn sản phẩm</InputLabel>
                  <Select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    label="Chọn sản phẩm"
                  >
                    <MenuItem value="All">Tất cả sản phẩm</MenuItem>
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 60 }}>
                  Lọc theo sao:
                </Typography>
                <ButtonGroup size="small">
                  <Button
                    variant={selectedRating === null ? "contained" : "outlined"}
                    onClick={() => setSelectedRating(null)}
                  >
                    Tất cả
                  </Button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={
                        selectedRating === rating ? "contained" : "outlined"
                      }
                      onClick={() => setSelectedRating(rating)}
                    >
                      {rating} sao
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {allReviews.map((review) => (
          <Card key={review.id}>
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.5}>
                {/* Product Info */}
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="flex-start"
                  sx={{
                    p: 0.5,
                    borderRadius: 0.5,
                    bgcolor: "grey.50",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 0.5,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      flexShrink: 0,
                    }}
                  >
                    {review.product.images?.[0] ? (
                      <img
                        src={review.product.images?.[0]}
                        alt={review.product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Avatar
                        src={review.product.images?.[0]}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 0.5,
                          bgcolor: "primary.light",
                        }}
                      >
                        {review.product.name}
                      </Avatar>
                    )}
                  </Box>
                  <Stack sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary"
                    >
                      {review.product.name} x {review.orderDetail?.quantity}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Review Content */}
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Avatar
                      src={review.user.avatar}
                      sx={{
                        width: 28,
                        height: 28,
                        border: "1px solid",
                        borderColor: "primary.main",
                      }}
                    />
                    <Stack sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {review.user.name}
                      </Typography>
                      <Stack direction="row" spacing={0.25} alignItems="center">
                        <Rating
                          value={review.rating}
                          readOnly
                          size="small"
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: "warning.main",
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(review.createdAt), "dd/MM/yyyy")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.3,
                      fontSize: "0.8125rem",
                    }}
                  >
                    {review.description}
                  </Typography>
                  {review.media && (
                    <Stack
                      direction="row"
                      spacing={0.25}
                      sx={{
                        mt: 0.5,
                        flexWrap: "wrap",
                        gap: 0.25,
                      }}
                    >
                      {review.media.map((media, index) => {
                        const isVideo =
                          media.toLowerCase().endsWith(".mp4") ||
                          media.toLowerCase().endsWith(".mov") ||
                          media.toLowerCase().endsWith(".webm");

                        return (
                          <Box
                            key={index}
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 0.5,
                              overflow: "hidden",
                              cursor: "pointer",
                              position: "relative",
                              border: "1px solid",
                              borderColor: "divider",
                              "&:hover": {
                                borderColor: "primary.main",
                                transform: "scale(1.02)",
                                transition: "all 0.2s ease",
                              },
                            }}
                            onClick={() =>
                              handleMediaClick(review.media || [], index)
                            }
                          >
                            {isVideo ? (
                              <>
                                <video
                                  src={media}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "white",
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    borderRadius: "50%",
                                    p: 0.25,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <PlayArrowIcon fontSize="small" />
                                </Box>
                              </>
                            ) : (
                              <img
                                src={media}
                                alt={`Review ${index + 1}`}
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
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {renderPagination(totalReviews)}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: 0.5, maxWidth: 1200, margin: "0 auto" }}>
      <Stack spacing={0.5}>
        {/* Header */}
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.5}
              >
                <Typography variant="h6" fontWeight={600}>
                  Đánh giá sản phẩm
                </Typography>
              </Stack>
              <Tabs
                value={viewType}
                onChange={(_, value) => setViewType(value)}
                sx={{ minHeight: 36 }}
              >
                <Tab
                  value="general"
                  label="Đánh giá chung"
                  sx={{ minHeight: 36, p: 0.5 }}
                />
                <Tab
                  value="all"
                  label="Tất cả đánh giá"
                  sx={{ minHeight: 36, p: 0.5 }}
                />
              </Tabs>
            </Stack>
          </CardContent>
        </Card>

        {/* Content */}
        {viewType === "general" && renderGeneralReviews()}
        {viewType === "all" && renderAllReviews()}
      </Stack>

      {/* Proof Dialog */}
      {selectedProof && (
        <Proof
          open={proofOpen}
          onClose={handleCloseProof}
          media={selectedProof.media}
          initialIndex={selectedProof.initialIndex}
        />
      )}

      {/* Image Detail Dialog */}
      {selectedMedia && (
        <ImageDetail
          open={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          currentMedia={selectedMedia}
          mediaList={selectedMediaList}
          onNext={handleNextMedia}
          onPrev={handlePrevMedia}
        />
      )}
    </Box>
  );
};

export default Review;
