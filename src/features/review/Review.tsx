import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Rating,
  Chip,
  Tabs,
  Tab,
  Divider,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ButtonGroup,
  Pagination,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Proof from "./Proof";

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  verified: boolean;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  recentReviews: Review[];
  productReviews: {
    [key: string]: {
      name: string;
      image: string;
      averageRating: number;
      totalReviews: number;
      reviews: Review[];
    };
  };
}

const mockReviewStats: ReviewStats = {
  totalReviews: 150,
  averageRating: 4.5,
  ratingDistribution: [
    { rating: 5, count: 80, percentage: 53.3 },
    { rating: 4, count: 45, percentage: 30 },
    { rating: 3, count: 15, percentage: 10 },
    { rating: 2, count: 5, percentage: 3.3 },
    { rating: 1, count: 5, percentage: 3.3 },
  ],
  recentReviews: [
    {
      id: "1",
      customerName: "Nguyễn Văn A",
      customerAvatar: "https://example.com/avatar1.jpg",
      productName: "Gạo ST25",
      productImage: "https://example.com/rice.jpg",
      rating: 5,
      comment:
        "Gạo rất ngon, chất lượng tốt, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ cửa hàng.",
      date: "2024-03-15",
      images: [
        "https://example.com/review1-1.jpg",
        "https://example.com/review1-2.jpg",
      ],
      verified: true,
    },
    {
      id: "2",
      customerName: "Trần Thị B",
      customerAvatar: "https://example.com/avatar2.jpg",
      productName: "Mật ong rừng",
      productImage: "https://example.com/honey.jpg",
      rating: 4,
      comment: "Mật ong thơm ngon, giá cả hợp lý. Chỉ hơi đặc một chút.",
      date: "2024-03-14",
      verified: true,
    },
    {
      id: "3",
      customerName: "Lê Văn C",
      customerAvatar: "https://example.com/avatar3.jpg",
      productName: "Cá basa",
      productImage: "https://example.com/fish.jpg",
      rating: 5,
      comment: "Cá tươi ngon, đóng gói đẹp, giao hàng nhanh. Rất hài lòng!",
      date: "2024-03-13",
      images: ["https://example.com/review3-1.jpg"],
      verified: true,
    },
  ],
  productReviews: {
    "gao-st25": {
      name: "Gạo ST25",
      image: "https://example.com/rice.jpg",
      averageRating: 4.8,
      totalReviews: 50,
      reviews: [
        {
          id: "1",
          customerName: "Nguyễn Văn A",
          customerAvatar: "https://example.com/avatar1.jpg",
          productName: "Gạo ST25",
          productImage: "https://example.com/rice.jpg",
          rating: 5,
          comment:
            "Gạo rất ngon, chất lượng tốt, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ cửa hàng.",
          date: "2024-03-15",
          images: [
            "https://example.com/review1-1.jpg",
            "https://example.com/review1-2.jpg",
          ],
          verified: true,
        },
        // Thêm các đánh giá khác cho sản phẩm này
      ],
    },
    "mat-ong": {
      name: "Mật ong rừng",
      image: "https://example.com/honey.jpg",
      averageRating: 4.5,
      totalReviews: 30,
      reviews: [
        {
          id: "2",
          customerName: "Trần Thị B",
          customerAvatar: "https://example.com/avatar2.jpg",
          productName: "Mật ong rừng",
          productImage: "https://example.com/honey.jpg",
          rating: 4,
          comment: "Mật ong thơm ngon, giá cả hợp lý. Chỉ hơi đặc một chút.",
          date: "2024-03-14",
          verified: true,
        },
        // Thêm các đánh giá khác cho sản phẩm này
      ],
    },
    // Thêm các sản phẩm khác
  },
};

const Review = () => {
  const [viewType, setViewType] = useState<"general" | "products" | "all">(
    "general",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [proofOpen, setProofOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState<{
    media: { type: "image" | "video"; url: string }[];
    initialIndex: number;
  } | null>(null);
  const [reviewStats] = useState<ReviewStats>(mockReviewStats);

  const ITEMS_PER_PAGE = 5;

  const handleProofClick = (images: string[], initialIndex: number) => {
    setSelectedProof({
      media: images.map((url) => ({ type: "image", url })),
      initialIndex,
    });
    setProofOpen(true);
  };

  const handleCloseProof = () => {
    setProofOpen(false);
    setSelectedProof(null);
  };

  const getPaginatedReviews = (reviews: Review[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return reviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const renderPagination = (totalItems: number) => (
    <Stack alignItems="center" sx={{ mt: 1 }}>
      <Pagination
        count={Math.ceil(totalItems / ITEMS_PER_PAGE)}
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
                {reviewStats.averageRating.toFixed(1)}
              </Typography>
              <Rating
                value={reviewStats.averageRating}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {reviewStats.totalReviews} đánh giá
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 2, minWidth: 300 }}>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              {reviewStats.ratingDistribution.map((dist) => (
                <Stack key={dist.rating} spacing={0.5}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="body2" sx={{ minWidth: 20 }}>
                      {dist.rating}
                    </Typography>
                    <Rating value={dist.rating} max={1} readOnly size="small" />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: "primary.lighter",
                          width: `${dist.percentage}%`,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ minWidth: 40 }}>
                      {dist.count}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Recent Reviews */}
      <Card>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Đánh giá gần đây
          </Typography>
          <Stack spacing={0.5}>
            {reviewStats.recentReviews.map((review) => (
              <Box key={review.id}>
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Avatar
                      src={review.customerAvatar}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Stack sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {review.customerName}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {review.date}
                        </Typography>
                        {review.verified && (
                          <Chip
                            label="Đã xác thực"
                            size="small"
                            color="success"
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Stack sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {review.productName}
                      </Typography>
                      <Typography variant="body2">{review.comment}</Typography>
                      {review.images && (
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {review.images.map((image, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1,
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                            >
                              <img
                                src={image}
                                alt={`Review ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
                <Divider sx={{ my: 0.5 }} />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );

  const renderProductReviews = () => {
    const filteredProducts = Object.entries(reviewStats.productReviews)
      .filter(
        ([productId]) => !selectedProduct || productId === selectedProduct,
      )
      .map(([productId, product]) => ({
        ...product,
        reviews: product.reviews.filter(
          (review) => !selectedRating || review.rating === selectedRating,
        ),
      }));

    return (
      <Stack spacing={0.5}>
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Chọn sản phẩm</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  label="Chọn sản phẩm"
                >
                  <MenuItem value="">Tất cả sản phẩm</MenuItem>
                  {Object.entries(reviewStats.productReviews).map(
                    ([productId, product]) => (
                      <MenuItem key={productId} value={productId}>
                        {product.name}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
              {selectedProduct && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    Lọc theo sao:
                  </Typography>
                  <ButtonGroup size="small">
                    <Button
                      variant={
                        selectedRating === null ? "contained" : "outlined"
                      }
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
              )}
            </Stack>
          </CardContent>
        </Card>

        {selectedProduct &&
          filteredProducts.map((product) => (
            <Card key={product.name}>
              <CardContent sx={{ p: 1 }}>
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Stack sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating
                          value={product.averageRating}
                          readOnly
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {product.totalReviews} đánh giá
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack spacing={0.5}>
                    {getPaginatedReviews(product.reviews).map((review) => (
                      <Box key={review.id}>
                        <Stack spacing={0.5}>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <Avatar
                              src={review.customerAvatar}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Stack sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={500}>
                                {review.customerName}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                              >
                                <Rating
                                  value={review.rating}
                                  readOnly
                                  size="small"
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {review.date}
                                </Typography>
                                {review.verified && (
                                  <Chip
                                    label="Đã xác thực"
                                    size="small"
                                    color="success"
                                  />
                                )}
                              </Stack>
                            </Stack>
                          </Stack>
                          <Typography variant="body2">
                            {review.comment}
                          </Typography>
                          {review.images && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              sx={{ mt: 0.5 }}
                            >
                              {review.images.map((image, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleProofClick(review.images || [], index)
                                  }
                                >
                                  <img
                                    src={image}
                                    alt={`Review ${index + 1}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Box>
                              ))}
                            </Stack>
                          )}
                        </Stack>
                        <Divider sx={{ my: 0.5 }} />
                      </Box>
                    ))}
                  </Stack>
                  {renderPagination(product.reviews.length)}
                </Stack>
              </CardContent>
            </Card>
          ))}
      </Stack>
    );
  };

  const renderAllReviews = () => {
    const allReviews = Object.values(reviewStats.productReviews)
      .flatMap((product) =>
        product.reviews.filter(
          (review) => !selectedRating || review.rating === selectedRating,
        ),
      )
      .filter(
        (review) =>
          review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.productName.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return (
      <Stack spacing={0.5}>
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm đánh giá..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
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

        {getPaginatedReviews(allReviews).map((review) => (
          <Card key={review.id}>
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Avatar
                    src={review.customerAvatar}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Stack sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {review.customerName}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {review.date}
                      </Typography>
                      {review.verified && (
                        <Chip
                          label="Đã xác thực"
                          size="small"
                          color="success"
                        />
                      )}
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Stack sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {review.productName}
                    </Typography>
                    <Typography variant="body2">{review.comment}</Typography>
                    {review.images && (
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                        {review.images.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              overflow: "hidden",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleProofClick(review.images || [], index)
                            }
                          >
                            <img
                              src={image}
                              alt={`Review ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {renderPagination(allReviews.length)}
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
                  value="products"
                  label="Đánh giá sản phẩm"
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
        {viewType === "products" && renderProductReviews()}
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
    </Box>
  );
};

export default Review;
