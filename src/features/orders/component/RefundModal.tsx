import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Stack,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { IOrder } from "../../../interface";

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder;
}

interface RefundRequest {
  reason: string;
  images: string[];
  videos: string[];
}

const RefundModal = ({ open, onClose, order }: RefundModalProps) => {
  const [refundRequest, setRefundRequest] = useState<RefundRequest>({
    reason: "",
    images: [],
    videos: [],
  });

  const handleReasonChange = (value: string) => {
    setRefundRequest((prev) => ({
      ...prev,
      reason: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const newVideos: string[] = [];
    const fileReaders: FileReader[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = (e) => {
        if (e.target?.result) {
          if (file.type.startsWith("image/")) {
            newImages.push(e.target.result as string);
          } else if (file.type.startsWith("video/")) {
            newVideos.push(e.target.result as string);
          }

          if (newImages.length + newVideos.length === files.length) {
            setRefundRequest((prev) => ({
              ...prev,
              images: [...prev.images, ...newImages],
              videos: [...prev.videos, ...newVideos],
            }));
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (type: "image" | "video", index: number) => {
    setRefundRequest((prev) => ({
      ...prev,
      images:
        type === "image"
          ? prev.images.filter((_, i) => i !== index)
          : prev.images,
      videos:
        type === "video"
          ? prev.videos.filter((_, i) => i !== index)
          : prev.videos,
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement submit logic
    console.log("Refund Request:", refundRequest);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Yêu cầu hoàn tiền</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1 }}>
        <Stack spacing={2}>
          {/* Order Information */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
              Thông tin đơn hàng
            </Typography>
            <Box
              sx={{
                p: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={0.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary" variant="body2">
                    Mã đơn hàng:
                  </Typography>
                  <Typography variant="body2">{order.id}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary" variant="body2">
                    Ngày đặt:
                  </Typography>
                  <Typography variant="body2">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary" variant="body2">
                    Tổng tiền:
                  </Typography>
                  <Typography
                    color="primary.main"
                    fontWeight={500}
                    variant="body2"
                  >
                    {order.totalPrice.toLocaleString()}đ
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Order Items */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
              Sản phẩm
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
                overflow: "hidden",
              }}
            >
              {order.orderDetails.map((item, index) => (
                <Box key={item.id}>
                  {index > 0 && <Divider />}
                  <Box
                    sx={{ p: 1, display: "flex", gap: 1, alignItems: "center" }}
                  >
                    <Avatar
                      variant="square"
                      src={item.product.images[0]}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {item.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.quantity} × {item.price.toLocaleString()}đ
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {(item.price * item.quantity).toLocaleString()}đ
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Reason Input */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
              Lý do yêu cầu hoàn tiền
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Vui lòng mô tả chi tiết lý do yêu cầu hoàn tiền..."
              value={refundRequest.reason}
              onChange={(e) => handleReasonChange(e.target.value)}
            />
          </Box>

          {/* Media Upload */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
              Hình ảnh/Video minh chứng
            </Typography>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {/* Images */}
              {refundRequest.images.map((image, index) => (
                <Box
                  key={`image-${index}`}
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
                    onClick={() => handleRemoveFile("image", index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {/* Videos */}
              {refundRequest.videos.map((video, index) => (
                <Box
                  key={`video-${index}`}
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                  }}
                >
                  <video
                    src={video}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
                    onClick={() => handleRemoveFile("video", index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Button
                component="label"
                variant="outlined"
                size="small"
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
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button onClick={onClose} size="small">
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={refundRequest.reason === ""}
          size="small"
        >
          Gửi yêu cầu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefundModal;
