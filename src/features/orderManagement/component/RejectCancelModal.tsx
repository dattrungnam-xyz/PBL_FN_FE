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
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IOrder } from "../../../interface";
import { getOrderStatusText, getStatusColor } from "../../../utils";
import { useState } from "react";

interface RejectCancelModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder | null;
  onReject: (reason: string) => void;
}

const RejectCancelModal = ({
  open,
  onClose,
  order,
  onReject,
}: RejectCancelModalProps) => {
  const [rejectReason, setRejectReason] = useState("");

  const handleReasonChange = (value: string) => {
    setRejectReason(value);
  };

  const handleSubmit = () => {
    onReject(rejectReason);
    setRejectReason("");
    onClose();
  };

  if (!order) return null;

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
          <Typography variant="h6">Từ chối yêu cầu hủy đơn</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1 }}>
        <Stack spacing={0.5}>
          {/* Order Status */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
              Trạng thái đơn hàng
            </Typography>
            <Chip
              label={getOrderStatusText(order.orderStatus)}
              color={getStatusColor(order.orderStatus)}
              size="small"
            />
          </Box>

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
                <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                  <Typography color="text.secondary" variant="body2">
                    Ngày giao hàng:
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingDate
                      ? new Date(order.shippingDate).toLocaleDateString(
                          "vi-VN",
                        )
                      : "Chưa giao hàng"}
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

          {/* Cancel Reason */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
              Lý do yêu cầu hủy
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
              <Typography variant="body2">{order.cancelReason}</Typography>
            </Box>
          </Box>

          {/* Reject Reason Input */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
              Lý do từ chối
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Vui lòng nhập lý do từ chối yêu cầu hủy đơn..."
              value={rejectReason}
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
          color="error"
          onClick={handleSubmit}
          disabled={rejectReason === ""}
          size="small"
        >
          Từ chối
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectCancelModal;
