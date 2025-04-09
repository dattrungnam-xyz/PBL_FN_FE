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
import { IOrder, IOrderDetail } from "../../../interface";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder;
  orderDetail: IOrderDetail;
}

interface ProductReview {
  rating: number;
  description: string;
  images: string[];
}

const ReviewModal = ({ open, onClose, orderDetail }: ReviewModalProps) => {
  const [review, setReview] = useState<ProductReview>({
    rating: 0,
    description: "",
    images: [],
  });

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const fileReaders: FileReader[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          if (newImages.length === files.length) {
            setReview((prev) => ({
              ...prev,
              images: [...prev.images, ...newImages],
            }));
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setReview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement submit logic
    console.log("Review:", review);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
                Hình ảnh đánh giá
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {review.images.map((image, imgIndex) => (
                  <Box
                    key={imgIndex}
                    sx={{
                      position: "relative",
                      width: 80,
                      height: 80,
                    }}
                  >
                    <Avatar
                      variant="square"
                      src={image}
                      sx={{ width: "100%", height: "100%" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "background.paper" },
                      }}
                      onClick={() => handleRemoveImage(imgIndex)}
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
                  <Typography variant="caption">Thêm ảnh</Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
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
    </Dialog>
  );
};

export default ReviewModal;
