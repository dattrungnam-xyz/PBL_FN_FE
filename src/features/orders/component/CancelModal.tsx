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
import { IOrder } from "../../../interface";

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder;
}

interface CancelRequest {
  reason: string;
}

const CancelModal = ({ open, onClose, order }: CancelModalProps) => {
  const [cancelRequest, setCancelRequest] = useState<CancelRequest>({
    reason: "",
  });

  const handleReasonChange = (value: string) => {
    setCancelRequest((prev) => ({
      ...prev,
      reason: value,
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement submit logic
    console.log("Cancel Request:", cancelRequest);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
          <Typography variant="h6">Hủy đơn hàng</Typography>
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
              Lý do hủy đơn hàng
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Vui lòng mô tả chi tiết lý do hủy đơn hàng..."
              value={cancelRequest.reason}
              onChange={(e) => handleReasonChange(e.target.value)}
            />
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
          disabled={cancelRequest.reason === ""}
          size="small"
        >
          Xác nhận hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelModal;
