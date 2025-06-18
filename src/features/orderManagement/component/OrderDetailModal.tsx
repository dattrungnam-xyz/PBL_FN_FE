import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import { IOrder } from "../../../interface";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NoteIcon from "@mui/icons-material/Note";

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder | null;
  children?: React.ReactNode;
}

const OrderDetailModal = ({
  open,
  onClose,
  order,
  children,
}: OrderDetailModalProps) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ p: 1.5, pb: 1 }}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Chi tiết đơn hàng
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 1.5 }}>
        {/* Customer Info */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <PersonIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Người mua
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {order.user.name}
            </Typography>
          </Box>
        </Stack>

        {/* Phone */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <PhoneIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Số điện thoại
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {order.user.phone}
            </Typography>
          </Box>
        </Stack>

        {/* Address */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <LocationOnIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Địa chỉ
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {order.address.textAddress}
            </Typography>
          </Box>
        </Stack>

        {/* Time */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <AccessTimeIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Thời gian
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <AccessTimeIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Ngày giao hàng
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {order.shippingDate
                ? new Date(order.shippingDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Chưa giao hàng"}
            </Typography>
          </Box>
        </Stack>
        {/* Note */}
        {order.note && (
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <NoteIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Ghi chú
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {order.note}
              </Typography>
            </Box>
          </Stack>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Products */}
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          Sản phẩm
        </Typography>
        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
          <Stack spacing={0.5}>
            {order.orderDetails.map((detail, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Avatar
                  variant="square"
                  src={detail.product.images[0]}
                  alt={detail.product.name}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "grey.300",
                    fontSize: "0.875rem",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  {detail.product.name.charAt(0)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>
                    {detail.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    x{detail.quantity}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="primary.main"
                >
                  {(detail.product.price * detail.quantity).toLocaleString()}đ
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Shipping Fee */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocalShippingIcon
              sx={{ fontSize: "1rem", color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              Phí vận chuyển
            </Typography>
          </Stack>
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {order.shippingFee.toLocaleString()}đ
          </Typography>
        </Stack>

        {/* Total */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Tổng tiền
          </Typography>
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {order.totalPrice.toLocaleString()}đ
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 1.5, pt: 0 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onClose}
          sx={{ fontSize: "0.813rem" }}
        >
          Đóng
        </Button>
        {children}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal;
