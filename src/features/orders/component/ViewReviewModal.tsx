import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Rating,
  Stack,
  IconButton,
  Avatar,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { IOrderDetail, IReview } from "../../../interface";
import ImageDetail from "../../../components/ImageDetail";

interface ViewReviewModalProps {
  open: boolean;
  onClose: () => void;
  orderDetail: IOrderDetail;
  review: IReview;
  onDelete: (reviewId: string) => void;
}

const ViewReviewModal = ({
  open,
  onClose,
  orderDetail,
  review,
  onDelete,
}: ViewReviewModalProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Xem đánh giá sản phẩm</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.75,
              }}
            >
              <Avatar
                variant="square"
                src={orderDetail.product.images[0]}
                alt={orderDetail.product.name}
                sx={{ width: 40, height: 40 }}
              />
              <Typography variant="subtitle1" fontWeight={500}>
                {orderDetail.product.name}
              </Typography>
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Đánh giá sản phẩm
              </Typography>
              <Rating value={review.rating} readOnly size="large" />
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Mô tả đánh giá
              </Typography>
              <Typography variant="body1">{review.description}</Typography>
            </Box>
            {review.media.length > 0 && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Hình ảnh & Video
                </Typography>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {review.media.map((mediaUrl, mediaIndex) => {
                    const isImage = mediaUrl.match(
                      /\.(jpg|jpeg|png|gif|webp)$/i,
                    );
                    return (
                      <Box
                        key={mediaIndex}
                        sx={{
                          position: "relative",
                          width: 80,
                          height: 80,
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedMedia(mediaUrl)}
                      >
                        {isImage ? (
                          <Avatar
                            variant="square"
                            src={mediaUrl}
                            sx={{ width: "100%", height: "100%" }}
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
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => onDelete(review.id)}
          sx={{ mr: 1 }}
          variant="outlined"
        >
          Xóa đánh giá
        </Button>
        <Button variant="contained" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
      {selectedMedia && (
        <ImageDetail
          open={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          currentMedia={selectedMedia}
          mediaList={review.media.map((m) => m)}
          onNext={() => {
            const currentIndex = review.media.findIndex(
              (m) => m === selectedMedia,
            );
            const nextIndex = (currentIndex + 1) % review.media.length;
            setSelectedMedia(review.media[nextIndex]);
          }}
          onPrev={() => {
            const currentIndex = review.media.findIndex(
              (m) => m === selectedMedia,
            );
            const prevIndex =
              (currentIndex - 1 + review.media.length) % review.media.length;
            setSelectedMedia(review.media[prevIndex]);
          }}
        />
      )}
    </Dialog>
  );
};

export default ViewReviewModal;
