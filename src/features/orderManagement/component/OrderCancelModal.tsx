import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IOrder } from "../../../interface";
import { getOrderStatusText, getStatusColor } from "../../../utils";
import ConfirmDialog from "../dialog/ConfirmDialog";
import RejectCancelModal from "./RejectCancelModal";
import { useState } from "react";
interface OrderCancelModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder | null;
  onReject: () => void;
  onAccept: () => void;
}

const OrderCancelModal = ({
  open,
  onClose,
  order,
  onReject,
  onAccept,
}: OrderCancelModalProps) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!order) return null;

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
            <Typography variant="h6">Chi tiết yêu cầu hủy đơn</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 1 }}>
          <Stack spacing={1}>
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

            {/* Shipping Address */}
            <Box>
              <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                Địa chỉ giao hàng
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
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Người nhận:
                    </Typography>
                    <Typography variant="body2">
                      {order.address.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Số điện thoại:
                    </Typography>
                    <Typography variant="body2">
                      {order.address.phone}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Địa chỉ:
                    </Typography>
                    <Typography variant="body2">
                      {order.address.textAddress}
                    </Typography>
                  </Box>
                </Stack>
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button variant="outlined" onClick={onClose} size="small">
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowAcceptModal(true)}
            size="small"
          >
            Xác nhận
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowRejectModal(true)}
            size="small"
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={showAcceptModal}
        onClose={(confirm) => {
          if (confirm) {
            onAccept();
          }
          setShowAcceptModal(false);
        }}
        title="Xác nhận hủy đơn"
        content="Bạn có chắc chắn muốn hủy đơn hàng này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        keepMounted={false}
      />
      <RejectCancelModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        order={order}
        onReject={onReject}
      />
    </>
  );
};

export default OrderCancelModal;
