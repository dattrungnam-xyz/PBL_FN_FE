import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Rating,
  TextField,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { IOrderDetail, ICreateReview } from "../../../interface";
import ImageDetail from "../../../components/ImageDetail";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  orderDetail: IOrderDetail;
  onSubmit: (review: ICreateReview) => void;
}

interface ProductReview {
  rating: number;
  description: string;
  media: {
    type: "image" | "audio";
    url: string;
  }[];
}

const ReviewModal = ({
  open,
  onClose,
  orderDetail,
  onSubmit,
}: ReviewModalProps) => {
  const [review, setReview] = useState<ProductReview>({
    rating: 0,
    description: "",
    media: [],
  });
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const handleRatingChange = (value: number) => {
    setReview((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setReview((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMedia: ProductReview["media"] = [];
    const fileReaders: FileReader[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = (e) => {
        if (e.target?.result) {
          const type = file.type.startsWith("image/") ? "image" : "audio";
          newMedia.push({
            type,
            url: e.target.result as string,
          });
          if (newMedia.length === files.length) {
            setReview((prev) => ({
              ...prev,
              media: [...prev.media, ...newMedia],
            }));
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (index: number) => {
    setReview((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      rating: review.rating,
      description: review.description,
      media: review.media.map((m) => m.url),
      orderDetailId: orderDetail.id,
    });
    onClose();
  };

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
          <Typography variant="h6">Đánh giá sản phẩm</Typography>
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
              <Rating
                value={review.rating}
                onChange={(_, value) => handleRatingChange(value || 0)}
                size="large"
              />
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Mô tả đánh giá
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                value={review.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
              />
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Hình ảnh & Âm thanh
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {review.media.map((media, mediaIndex) => (
                  <Box
                    key={mediaIndex}
                    sx={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedMedia(media.url)}
                  >
                    {media.type === "image" ? (
                      <Avatar
                        variant="square"
                        src={media.url}
                        sx={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <video
                        src={media.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "background.paper" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMedia(mediaIndex);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    minWidth: "unset",
                  }}
                >
                  <AddPhotoAlternateIcon fontSize="small" />
                  <Typography variant="caption">Thêm file</Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*,audio/*"
                    onChange={handleMediaUpload}
                  />
                </Button>
              </Box>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1.5 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={review.rating === 0 || review.description === ""}
        >
          Gửi đánh giá
        </Button>
      </DialogActions>
      {selectedMedia && (
        <ImageDetail
          open={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          currentMedia={selectedMedia}
          mediaList={review.media.map((m) => m.url)}
          onNext={() => {
            const currentIndex = review.media.findIndex(
              (m) => m.url === selectedMedia,
            );
            const nextIndex = (currentIndex + 1) % review.media.length;
            setSelectedMedia(review.media[nextIndex].url);
          }}
          onPrev={() => {
            const currentIndex = review.media.findIndex(
              (m) => m.url === selectedMedia,
            );
            const prevIndex =
              (currentIndex - 1 + review.media.length) % review.media.length;
            setSelectedMedia(review.media[prevIndex].url);
          }}
        />
      )}
    </Dialog>
  );
};

export default ReviewModal;
