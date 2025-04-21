import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Rating,
  Divider,
  IconButton,
  Stack,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { getProductById } from "../../../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ImageDetail from "../../../components/ImageDetail";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { IOrderDetail, IReview } from "../../../interface";
import {
  getCategoryText,
  getSellingStatusText,
  getVerifyOCOPStatusText,
} from "../../../utils";
import { VerifyOCOPStatus } from "../../../enums";

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
}

const AdminProductModal = ({
  open,
  onClose,
  productId,
}: ProductDetailModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => url?.toLowerCase()?.endsWith(ext));
  };

  if (!product) return null;
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ p: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Chi tiết sản phẩm
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 1.5 }}>
          <Stack spacing={1}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {product?.name}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Rating
                  value={product?.star || 0}
                  readOnly
                  precision={0.5}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({product?.star} sao OCOP)
                </Typography>
                {product?.verifyOcopStatus === VerifyOCOPStatus.VERIFIED && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Đã xác thực"
                    color="success"
                    size="small"
                    sx={{ ml: 0.5 }}
                  />
                )}
              </Stack>
            </Box>

            {product?.images && product?.images?.length > 0 && (
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  mb={0.5}
                >
                  <ImageIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Hình ảnh sản phẩm
                  </Typography>
                </Stack>
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  sx={{
                    "& img": {
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 0.5,
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    },
                  }}
                >
                  {product.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 0.5 }} />

            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              sx={{
                "& > .info-item": {
                  flex: "1 1 180px",
                  minWidth: "180px",
                  p: 1,
                  borderRadius: 0.5,
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                },
                "& .info-icon": {
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  borderColor: "primary.main",
                  color: "primary.main",
                  mb: 0.5,
                },
                "& .info-label": {
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  mb: 0.25,
                },
                "& .info-value": {
                  fontWeight: 500,
                  fontSize: "0.875rem",
                },
              }}
            >
              <Box className="info-item">
                <Box className="info-icon">
                  <AttachMoneyIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography className="info-label">Giá sản phẩm</Typography>
                <Typography className="info-value">
                  {product?.price?.toLocaleString()} VNĐ
                </Typography>
              </Box>

              <Box className="info-item">
                <Box className="info-icon">
                  <CategoryIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography className="info-label">Danh mục</Typography>
                <Typography className="info-value">
                  {getCategoryText(product.category)}
                </Typography>
              </Box>

              <Box className="info-item">
                <Box className="info-icon">
                  <InventoryIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography className="info-label">Tồn kho / Đã bán</Typography>
                <Typography className="info-value">
                  {product?.quantity || 0} /{" "}
                  {product?.orderDetails?.reduce(
                    (acc: number, curr: IOrderDetail) => acc + curr.quantity,
                    0,
                  ) || 0}
                </Typography>
              </Box>

              <Box className="info-item">
                <Box className="info-icon">
                  <StarIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography className="info-label">
                  Đánh giá trung bình
                </Typography>
                <Typography className="info-value">
                  {(
                    product.reviews?.reduce(
                      (acc: number, curr: IReview) => acc + curr.rating,
                      0,
                    ) / (product?.reviews?.length || 0) || 0
                  ).toFixed(1)}{" "}
                  / 5
                </Typography>
              </Box>

              <Box className="info-item">
                <Box className="info-icon">
                  <VerifiedIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography className="info-label">Trạng thái bán</Typography>
                <Chip
                  label={getSellingStatusText(product.status)}
                  color={
                    product?.status === "SELLING"
                      ? "success"
                      : product?.status === "STOPPED"
                        ? "error"
                        : "warning"
                  }
                  size="small"
                  sx={{
                    mt: 0.25,
                    height: 20,
                    "& .MuiChip-label": {
                      px: 0.5,
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Box>

              <Box className="info-item">
                <Box className="info-icon">
                  <VerifiedIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography className="info-label">
                  Trạng thái xác thực
                </Typography>
                <Chip
                  label={getVerifyOCOPStatusText(product.verifyOcopStatus)}
                  color={
                    product?.verifyOcopStatus === VerifyOCOPStatus.VERIFIED
                      ? "success"
                      : product?.verifyOcopStatus === VerifyOCOPStatus.REJECTED
                        ? "error"
                        : "warning"
                  }
                  size="small"
                  sx={{
                    mt: 0.25,
                    height: 20,
                    "& .MuiChip-label": {
                      px: 0.5,
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                <DescriptionIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Mô tả sản phẩm
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {product?.description}
              </Typography>
            </Box>

            {product?.verifyOcopStatus === VerifyOCOPStatus.VERIFIED && (
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  mb={0.5}
                >
                  <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Thông tin xác thực OCOP
                  </Typography>
                </Stack>
                <Card variant="outlined" sx={{ p: 1 }}>
                  <Stack spacing={1}>
                    {(() => {
                      const latestVerify = product?.verify
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
                        <>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={latestVerify.images?.[0] || ""}
                              variant="rounded"
                              sx={{
                                width: 60,
                                height: 60,
                                cursor: "pointer",
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                              onClick={() =>
                                handleImageClick(latestVerify.images?.[0] || "")
                              }
                            />
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {latestVerify.productName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Cơ sở sản xuất: {latestVerify.manufacturer}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
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
                              variant="subtitle2"
                              fontWeight="bold"
                              mb={0.5}
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
                                size="small"
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {latestVerify.star} sao
                              </Typography>
                            </Stack>
                          </Box>

                          {latestVerify.images &&
                            latestVerify.images.length > 0 && (
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                  mb={0.5}
                                >
                                  Hình ảnh chứng nhận
                                </Typography>
                                <Box
                                  display="flex"
                                  flexWrap="wrap"
                                  gap={1}
                                  sx={{
                                    "& img": {
                                      width: 50,
                                      height: 50,
                                      objectFit: "cover",
                                      borderRadius: 1,
                                      cursor: "pointer",
                                      transition: "all 0.2s ease-in-out",
                                      border: "1px solid",
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
                                      onClick={() => handleImageClick(image)}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                        </>
                      );
                    })()}
                  </Stack>
                </Card>
              </Box>
            )}

            {product?.reviews && product.reviews.length > 0 && (
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  mb={0.5}
                >
                  <StarIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Đánh giá gần đây
                  </Typography>
                </Stack>
                <Stack spacing={0.5}>
                  {product.reviews.slice(0, 3).map((review: IReview) => (
                    <Card key={review.id} variant="outlined" sx={{ p: 0.5 }}>
                      <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                        <Stack spacing={0.25}>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <Avatar
                              src={review.user.avatar}
                              sx={{ width: 20, height: 20 }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                              {review.user.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ ml: "auto" }}
                            >
                              {format(
                                new Date(review.createdAt),
                                "dd/MM/yyyy",
                                {
                                  locale: vi,
                                },
                              )}
                            </Typography>
                          </Stack>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            precision={0.5}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {review.description}
                          </Typography>
                          {review.media && review.media.length > 0 && (
                            <Box
                              display="flex"
                              gap={0.5}
                              sx={{
                                "& img, & video": {
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 0.5,
                                  cursor: "pointer",
                                },
                                "& .video-thumbnail": {
                                  position: "relative",
                                  "& .play-icon": {
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "white",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    borderRadius: "50%",
                                    padding: 0.5,
                                  },
                                },
                              }}
                            >
                              {review.media.map((media, index) =>
                                isVideoUrl(media) ? (
                                  <Box
                                    key={index}
                                    className="video-thumbnail"
                                    onClick={() => handleImageClick(media)}
                                  >
                                    <video src={media} />
                                    <Box className="play-icon">
                                      <PlayArrowIcon sx={{ fontSize: 20 }} />
                                    </Box>
                                  </Box>
                                ) : (
                                  <img
                                    key={index}
                                    src={media}
                                    alt={`Review media ${index + 1}`}
                                    onClick={() => handleImageClick(media)}
                                  />
                                ),
                              )}
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <ImageDetail
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        currentMedia={selectedImage || ""}
        mediaList={product?.images || []}
        onNext={() => {
          if (product?.images) {
            const currentIndex = product.images.findIndex(
              (img: string) => img === selectedImage,
            );
            const nextIndex = (currentIndex + 1) % product.images.length;
            setSelectedImage(product.images[nextIndex]);
          }
        }}
        onPrev={() => {
          if (product?.images) {
            const currentIndex = product.images.findIndex(
              (img: string) => img === selectedImage,
            );
            const prevIndex =
              (currentIndex - 1 + product.images.length) %
              product.images.length;
            setSelectedImage(product.images[prevIndex]);
          }
        }}
      />
    </>
  );
};

export default AdminProductModal;
