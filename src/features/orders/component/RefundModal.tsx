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
import DeleteIcon from "@mui/icons-material/Delete";
import { IOrder, IRefundRequest } from "../../../interface";
import Proof from "./Proof";

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder;
  onSubmit: (refundRequest: IRefundRequest) => void;
}

const RefundModal = ({ open, onClose, order, onSubmit }: RefundModalProps) => {
  const [refundRequest, setRefundRequest] = useState<IRefundRequest>({
    refundReason: "",
    refundReasonImage: [],
  });

  const [errors, setErrors] = useState<{
    refundReason: string;
    refundReasonImage: string;
  }>({
    refundReason: "",
    refundReasonImage: "",
  });
  const [selectedProof, setSelectedProof] = useState<{
    file: string;
    index: number;
  } | null>(null);

  const handleReasonChange = (value: string) => {
    setRefundRequest((prev) => ({
      ...prev,
      refundReason: value,
    }));
    setErrors((prev) => ({
      ...prev,
      refundReason: "",
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: string[] = [];
    const fileReaders: FileReader[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = (e) => {
        if (e.target?.result) {
          newFiles.push(e.target.result as string);

          if (newFiles.length === files.length) {
            setRefundRequest((prev) => ({
              ...prev,
              refundReasonImage: [...prev.refundReasonImage, ...newFiles],
            }));
            setErrors((prev) => ({
              ...prev,
              refundReasonImage: "",
            }));
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index: number) => {
    setRefundRequest((prev) => ({
      ...prev,
      refundReasonImage: prev.refundReasonImage.filter((_, i) => i !== index),
    }));
  };

  const handleOpenProof = (file: string, index: number) => {
    setSelectedProof({ file, index });
  };

  const handleCloseProof = () => {
    setSelectedProof(null);
  };

  const handleSubmit = () => {
    const newErrors: {
      refundReason: string;
      refundReasonImage: string;
    } = {
      ...errors,
    };

    if (refundRequest.refundReason === "") {
      newErrors.refundReason = "Vui lòng nhập lý do yêu cầu trả hàng";
    }
    if (refundRequest.refundReasonImage.length === 0) {
      newErrors.refundReasonImage =
        "Vui lòng tải lên ít nhất một hình ảnh hoặc video làm bằng chứng";
    }

    if (newErrors.refundReason !== "" || newErrors.refundReasonImage !== "") {
      setErrors(newErrors);
      return;
    }
    onSubmit(refundRequest);
    onClose();
  };

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
            <Typography variant="h6">Yêu cầu trả hàng</Typography>
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      Mã đơn hàng:
                    </Typography>
                    <Typography variant="body2">{order.id}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      Ngày đặt:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                      sx={{
                        p: 1,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
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
                Lý do yêu cầu trả hàng
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="Vui lòng mô tả chi tiết lý do yêu cầu trả hàng..."
                value={refundRequest.refundReason}
                onChange={(e) => handleReasonChange(e.target.value)}
                error={errors.refundReason !== ""}
                helperText={errors.refundReason}
              />
            </Box>

            {/* Refund Images/Videos */}
            <Box>
              <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                Hình ảnh/Video minh chứng
              </Typography>
              <Box
                sx={{
                  p: 1,
                  border: 1,
                  borderColor:
                    errors.refundReasonImage !== "" ? "error.main" : "divider",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {refundRequest.refundReasonImage.map((file, index) => {
                    const isImage =
                      file.startsWith("data:image/") ||
                      file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                      file.includes("cloudinary.com");

                    return (
                      <Box
                        key={`file-${index}`}
                        onClick={() => handleOpenProof(file, index)}
                        sx={{
                          width: 120,
                          height: 120,
                          position: "relative",
                          borderRadius: 1,
                          overflow: "hidden",
                          border: 1,
                          borderColor: "divider",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        {isImage ? (
                          <img
                            src={file}
                            alt={`Minh chứng ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <video
                            src={file}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          sx={{
                            position: "absolute",
                            right: 4,
                            top: 4,
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.7)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    );
                  })}
                  <Box
                    component="label"
                    htmlFor="file-upload"
                    sx={{
                      width: 120,
                      height: 120,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <AddPhotoAlternateIcon color="action" />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                      fontSize="12px"
                    >
                      Thêm minh chứng
                    </Typography>
                  </Box>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </Box>
                {errors.refundReasonImage !== "" && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Vui lòng tải lên ít nhất một hình ảnh hoặc video minh chứng
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={onClose} size="small">
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSubmit} size="small">
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>

      {selectedProof && (
        <Proof
          open={!!selectedProof}
          onClose={handleCloseProof}
          file={selectedProof.file}
          index={selectedProof.index}
        />
      )}
    </>
  );
};

export default RefundModal;
