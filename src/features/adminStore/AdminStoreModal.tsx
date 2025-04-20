import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  CardMedia,
  SxProps,
  Theme,
} from "@mui/material";
import { VerifiedUser } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import StarIcon from "@mui/icons-material/Star";
import { useState, useEffect } from "react";
import ImageDetail from "../../components/ImageDetail";
import { IStore } from "../../interface";
import { OrderStatus } from "../../enums";
import { getStoreById } from "../../services/store.service";
import BarChartIcon from "@mui/icons-material/BarChart";

interface AdminStoreModalProps {
  open: boolean;
  onClose: () => void;
  storeId: string;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sx?: SxProps<Theme>;
}

const AdminStoreModal = ({ open, onClose, storeId }: AdminStoreModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [store, setStore] = useState<IStore | null>(null);
  const [rating, setRating] = useState<number>(0);
  useEffect(() => {
    const fetchStore = async () => {
      const store = await getStoreById(storeId);
      setStore(store);
      let totalRating = 0;
      let count = 0;
      store?.orders?.forEach((order) => {
        order.orderDetails.forEach((product) => {
          if (product.review) {
            totalRating += product.review?.rating || 0;
            count++;
          }
        });
      });
      setRating(count > 0 ? totalRating / count : 0);
    };
    fetchStore();
  }, [storeId]);

  const handleCloseImageDetail = () => {
    setSelectedImage(null);
  };

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: JSX.Element;
    label: string;
    value: string | number;
  }) => (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Stack>
  );

  const StatItem = ({ icon, label, value, sx }: StatItemProps) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1.5,
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: 1,
          ...sx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: "background.default",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {value}
          </Typography>
        </Box>
      </Box>
    );
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
              borderRadius: 1,
            },
          },
        }}
      >
        <DialogContent sx={{ p: 1 }}>
          <Stack spacing={1}>
            {/* Header */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={600}>
                Chi tiết cửa hàng
              </Typography>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Stack>

            {/* Store Banner */}
            {store?.banner && (
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 1,
                  display: "flex",
                }}
              >
                <CardMedia
                  component="img"
                  image={store?.banner}
                  alt="Store banner"
                  sx={{ height: "100%", objectFit: "cover", maxHeight: 120 }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -40,
                    left: 16,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: "4px solid white",
                    overflow: "hidden",
                    mb: 1,
                  }}
                >
                  <Avatar
                    src={store?.avatar}
                    sx={{ width: "100%", height: "100%", zIndex: 10 }}
                  >
                    <StorefrontIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
              </Box>
            )}

            {/* Basic Info */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                mt: store?.banner ? 4 : 0,
                pt: 1,
              }}
            >
              {!store?.banner && (
                <Avatar src={store?.avatar} sx={{ width: 64, height: 64 }}>
                  <StorefrontIcon sx={{ fontSize: 32 }} />
                </Avatar>
              )}
              <Box>
                <Typography variant="h6" gutterBottom>
                  {store?.name}
                </Typography>
                <Stack
                  spacing={0.5}
                  flexWrap="wrap"
                  flexDirection="row"
                  gap={1}
                >
                  <InfoItem
                    icon={<PersonIcon fontSize="small" color="action" />}
                    label="Chủ sở hữu"
                    value={store?.user?.name || ""}
                  />
                  <InfoItem
                    icon={<EmailIcon fontSize="small" color="action" />}
                    label="Email"
                    value={store?.user?.email || ""}
                  />
                  <InfoItem
                    icon={<LocalPhoneIcon fontSize="small" color="action" />}
                    label="Số điện thoại"
                    value={store?.phone || ""}
                  />
                  <InfoItem
                    icon={<LocationOnIcon fontSize="small" color="action" />}
                    label="Địa chỉ"
                    value={`${store?.address}, ${store?.wardName}, ${store?.districtName}, ${store?.provinceName}`}
                  />
                </Stack>
              </Box>
            </Box>

            {/* Stats */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Thống kê
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  "& > *": {
                    flex: "1 1 200px",
                    minWidth: "200px",
                    maxWidth: "300px",
                  },
                }}
              >
                <StatItem
                  icon={
                    <InventoryIcon
                      sx={{ fontSize: 20, color: "primary.main" }}
                    />
                  }
                  label="Số sản phẩm"
                  value={store?.products?.length || 0}
                  sx={{
                    bgcolor: "primary.lighter",
                    "& .MuiTypography-root": {
                      color: "primary.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <InventoryIcon
                      sx={{ fontSize: 20, color: "success.main" }}
                    />
                  }
                  label="Đã bán"
                  value={
                    store?.orders?.reduce(
                      (acc, order) =>
                        acc +
                        order.orderDetails.reduce(
                          (acc, product) => acc + product.quantity,
                          0,
                        ),
                      0,
                    ) || 0
                  }
                  sx={{
                    bgcolor: "success.lighter",
                    "& .MuiTypography-root": {
                      color: "success.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <LocalShippingIcon
                      sx={{ fontSize: 20, color: "info.main" }}
                    />
                  }
                  label="Tổng đơn hàng"
                  value={store?.orders?.length || 0}
                  sx={{
                    bgcolor: "info.lighter",
                    "& .MuiTypography-root": {
                      color: "info.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <CheckCircleIcon
                      sx={{ fontSize: 20, color: "success.main" }}
                    />
                  }
                  label="Đơn thành công"
                  value={
                    store?.orders?.filter(
                      (order) => order.orderStatus === OrderStatus.COMPLETED,
                    ).length || 0
                  }
                  sx={{
                    bgcolor: "success.lighter",
                    "& .MuiTypography-root": {
                      color: "success.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <CancelIcon sx={{ fontSize: 20, color: "error.main" }} />
                  }
                  label="Đơn hủy"
                  value={
                    store?.orders?.filter(
                      (order) => order.orderStatus === OrderStatus.CANCELLED,
                    ).length || 0
                  }
                  sx={{
                    bgcolor: "error.lighter",
                    "& .MuiTypography-root": {
                      color: "error.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <AssignmentReturnIcon
                      sx={{ fontSize: 20, color: "warning.main" }}
                    />
                  }
                  label="Đơn hoàn trả"
                  value={
                    store?.orders?.filter(
                      (order) => order.orderStatus === OrderStatus.REFUNDED,
                    ).length || 0
                  }
                  sx={{
                    bgcolor: "warning.lighter",
                    "& .MuiTypography-root": {
                      color: "warning.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <StarIcon sx={{ fontSize: 20, color: "warning.main" }} />
                  }
                  label="Đánh giá"
                  value={rating}
                  sx={{
                    bgcolor: "warning.lighter",
                    "& .MuiTypography-root": {
                      color: "warning.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <BarChartIcon sx={{ fontSize: 20, color: "info.main" }} />
                  }
                  label="Doanh thu"
                  value={`${
                    store?.orders
                      ?.filter(
                        (order) =>
                          order.orderStatus !== OrderStatus.REFUNDED &&
                          order.orderStatus !== OrderStatus.CANCELLED &&
                          order.orderStatus !== OrderStatus.REJECTED,
                      )
                      .reduce(
                        (acc, order) =>
                          acc + order.totalPrice - order.shippingFee,
                        0,
                      ) || 0
                  }đ`}
                  sx={{
                    bgcolor: "info.lighter",
                    "& .MuiTypography-root": {
                      color: "info.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <VerifiedUser
                      sx={{ fontSize: 20, color: "success.main" }}
                    />
                  }
                  label="Đã xác thực"
                  value={0}
                  sx={{
                    bgcolor: "success.lighter",
                    "& .MuiTypography-root": {
                      color: "success.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <VerifiedUser
                      sx={{ fontSize: 20, color: "warning.main" }}
                    />
                  }
                  label="Chờ xác thực"
                  value={0}
                  sx={{
                    bgcolor: "warning.lighter",
                    "& .MuiTypography-root": {
                      color: "warning.main",
                    },
                  }}
                />
                <StatItem
                  icon={
                    <PersonIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  }
                  label="Khách hàng"
                  value={
                    new Set(store?.orders?.map((order) => order.user.id))
                      .size || 0
                  }
                  sx={{
                    bgcolor: "primary.lighter",
                    "& .MuiTypography-root": {
                      color: "primary.main",
                    },
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetail
          open={Boolean(selectedImage)}
          onClose={handleCloseImageDetail}
          currentMedia={selectedImage}
          mediaList={[selectedImage]}
          onNext={() => {}}
          onPrev={() => {}}
        />
      )}
    </>
  );
};

export default AdminStoreModal;
