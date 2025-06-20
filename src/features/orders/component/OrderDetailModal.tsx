import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Divider,
  Chip,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IOrder } from "../../../interface";
import { getOrderStatusText } from "../../../utils";
import { OrderStatus } from "../../../enums/orderStatus.enum";
import Proof from "./Proof";
import { useState } from "react";
import { PaymentStatus } from "../../../enums/paymentStatus.enum";

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder;
}

const OrderDetailModal = ({ open, onClose, order }: OrderDetailModalProps) => {
  const [selectedProof, setSelectedProof] = useState<{
    file: string;
    index: number;
  } | null>(null);

  const handleOpenProof = (file: string, index: number) => {
    setSelectedProof({ file, index });
  };

  const handleCloseProof = () => {
    setSelectedProof(null);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "warning";
      case OrderStatus.PENDING_PAYMENT:
        return "info";
      case OrderStatus.PREPARING_FOR_SHIPPING:
        return "primary";
      case OrderStatus.SHIPPING:
        return "success";
      case OrderStatus.COMPLETED:
        return "success";
      case OrderStatus.CANCELLED:
        return "error";
      case OrderStatus.REFUNDED:
        return "error";
      case OrderStatus.REJECTED:
        return "error";
      case OrderStatus.REQUIRE_CANCEL:
        return "error";
      case OrderStatus.REQUIRE_REFUND:
        return "error";
      default:
        return "default";
    }
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
            <Typography variant="h6">Chi tiết đơn hàng</Typography>
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
            <Box>
              <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                Thanh toán
              </Typography>
              {order.payment.paymentStatus === PaymentStatus.PAID ? (
                <Chip label="Đã thanh toán" color="success" size="small" />
              ) : (
                <Chip label="Chưa thanh toán" color="error" size="small" />
              )}
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

            {/* Refund Information */}
            {order.refundReason ? (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 0.5 }}
                >
                  Lý do yêu cầu trả hàng
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
                  <Typography variant="body2">{order.refundReason}</Typography>
                </Box>
              </Box>
            ) : null}

            {order.cancelReason ? (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 0.5 }}
                >
                  Lý do hủy đơn
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
            ) : null}

            {/* Refund Images/Videos */}
            {order.refundReasonImage && order.refundReasonImage.length > 0 ? (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 0.5 }}
                >
                  Hình ảnh/Video minh chứng
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {order.refundReasonImage.map((file, index) => {
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
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : null}

            {order.rejectReason ? (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 0.5 }}
                >
                  Lý do bị từ chối
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
                  <Typography variant="body2">{order.rejectReason}</Typography>
                </Box>
              </Box>
            ) : null}

            {/* Shipping Information */}
            <Box>
              <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                Thông tin giao hàng
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={onClose} size="small">
            Đóng
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

export default OrderDetailModal;
