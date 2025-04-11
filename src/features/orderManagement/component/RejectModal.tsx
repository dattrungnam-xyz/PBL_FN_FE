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
import { useState } from "react";
import Proof from "../../orders/component/Proof";

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  order: IOrder | null;
}

const RejectModal = ({ open, onClose, order }: RejectModalProps) => {
  const [selectedProof, setSelectedProof] = useState<{
    file: string;
    index: number;
  } | null>(null);

  if (!order) return null;

  const handleOpenProof = (file: string, index: number) => {
    setSelectedProof({ file, index });
  };

  const handleCloseProof = () => {
    setSelectedProof(null);
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
            <Typography variant="h6">Chi tiết yêu cầu bị từ chối</Typography>
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
                        sx={{
                          width: 40,
                          height: 40,
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() =>
                          handleOpenProof(item.product.images[0], 0)
                        }
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

            {/* Rejection Reason */}
            {order.rejectReason && (
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
            )}

            {/* Cancel Reason */}
            {order.cancelReason && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 0.5 }}
                >
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
            )}

            {/* Refund Reason */}
            {order.refundReason && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 0.5 }}
                >
                  Lý do yêu cầu hoàn tiền
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
            )}

            {/* Refund Images */}
            {order.refundReasonImage && order.refundReasonImage.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 0.5 }}
                >
                  Hình ảnh minh chứng
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {order.refundReasonImage.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 120,
                        height: 120,
                        position: "relative",
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => handleOpenProof(file, index)}
                    >
                      <img
                        src={file}
                        alt={`Proof ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
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
          open={true}
          onClose={handleCloseProof}
          file={selectedProof.file}
          index={selectedProof.index}
        />
      )}
    </>
  );
};

export default RejectModal;
