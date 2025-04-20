import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Card,
  CardContent,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import ImageDetail from "../../../components/ImageDetail";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { IUser } from "../../../interface/user.interface";
import { OrderStatus } from "../../../enums";
import { formatPrice, getAddressTypeText, isVideoUrl } from "../../../utils";
import { IAddress } from "../../../interface/userAddress.interface";
import { IReview } from "../../../interface/review.interface";
import { getUserById } from "../../../services/user.service";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 0.5 }}>{children}</Box>}
    </div>
  );
}

interface AdminUserModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string | null;
}

const AdminUserModal = ({ open, onClose, userId }: AdminUserModalProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [user, setUser] = useState<IUser | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImageClick = (imageUrl: string, mediaList: string[]) => {
    setMediaList(mediaList);
    const index = mediaList.indexOf(imageUrl);
    setSelectedImageIndex(index);
    setSelectedImage(imageUrl);
  };

  const handleNextImage = () => {
    if (selectedImageIndex < mediaList.length - 1) {
      const nextIndex = selectedImageIndex + 1;
      setSelectedImageIndex(nextIndex);
      setSelectedImage(mediaList[nextIndex]);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1;
      setSelectedImageIndex(prevIndex);
      setSelectedImage(mediaList[prevIndex]);
    }
  };

  const handleCloseImageDetail = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
    setMediaList([]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const user = await getUserById(userId);
        setUser(user);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <>
      {user ? (
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
          <DialogTitle sx={{ p: 0.75 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                Thông tin người dùng
              </Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0.75 }}>
            <Stack spacing={1}>
              <Box display="flex" gap={0.5} alignItems="center">
                <Avatar
                  src={user.avatar}
                  sx={{ width: 50, height: 50, cursor: "pointer" }}
                  onClick={() =>
                    handleImageClick(user.avatar || "", [user.avatar || ""])
                  }
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                  {user.seller && (
                    <Chip
                      label={user.seller.name}
                      color="primary"
                      size="small"
                      sx={{ mt: 0.25 }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Thông tin chung" />
                  <Tab label="Địa chỉ" />
                  <Tab label="Đánh giá" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Stack spacing={1}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <Card variant="outlined" sx={{ flex: 1, minWidth: 160 }}>
                      <CardContent sx={{ p: 0.75 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tổng đơn đặt
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {user.orders.length || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: 1, minWidth: 160 }}>
                      <CardContent sx={{ p: 0.75 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tổng đơn nhận
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {user.orders.filter(
                            (order) =>
                              order.orderStatus === OrderStatus.COMPLETED,
                          ).length || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: 1, minWidth: 160 }}>
                      <CardContent sx={{ p: 0.75 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tổng đơn hủy
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {user.orders.filter(
                            (order) =>
                              order.orderStatus === OrderStatus.CANCELLED,
                          ).length || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: 1, minWidth: 160 }}>
                      <CardContent sx={{ p: 0.75 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tổng chi tiêu
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {formatPrice(
                            user.orders
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
                              ),
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Stack spacing={1}>
                  {user.addresses?.map((address: IAddress) => (
                    <Card key={address.id} variant="outlined">
                      <CardContent sx={{ p: 0.75 }}>
                        <Stack spacing={0.5}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight="medium">
                              {address.name}
                            </Typography>
                            <Chip
                              label={getAddressTypeText(address.type)}
                              size="small"
                              color={"primary"}
                            />
                          </Box>
                          <Typography variant="body2">
                            {address.phone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.textAddress}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <Stack spacing={0.5}>
                    {user.reviews?.map((review: IReview) => (
                      <Card key={review.id} variant="outlined">
                        <CardContent sx={{ p: 0.75 }}>
                          <Stack spacing={0.5}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="medium"
                                >
                                  {review.product.name}
                                </Typography>
                                <Rating
                                  value={review.rating}
                                  readOnly
                                  size="small"
                                />
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {format(
                                  new Date(review.createdAt),
                                  "dd/MM/yyyy",
                                  { locale: vi },
                                )}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {review.description}
                            </Typography>
                            {review.media && review.media.length > 0 && (
                              <Box
                                display="flex"
                                gap={0.5}
                                sx={{
                                  maxHeight: 80,
                                  overflowY: "auto",
                                  "&::-webkit-scrollbar": {
                                    width: 4,
                                    height: 4,
                                  },
                                  "&::-webkit-scrollbar-track": {
                                    background: "transparent",
                                  },
                                  "&::-webkit-scrollbar-thumb": {
                                    background: "rgba(0, 0, 0, 0.2)",
                                    borderRadius: 2,
                                  },
                                  "& img, & video": {
                                    width: 32,
                                    height: 32,
                                    objectFit: "cover",
                                    borderRadius: 0.5,
                                    cursor: "pointer",
                                  },
                                  "& .video-thumbnail": {
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                    "& .play-icon": {
                                      position: "absolute",
                                      color: "white",
                                      fontSize: 16,
                                    },
                                  },
                                }}
                              >
                                {review.media.map(
                                  (media: string, index: number) => (
                                    <Box
                                      key={index}
                                      className={
                                        isVideoUrl(media)
                                          ? "video-thumbnail"
                                          : ""
                                      }
                                      onClick={() =>
                                        handleImageClick(media, review.media)
                                      }
                                    >
                                      {isVideoUrl(media) ? (
                                        <>
                                          <video src={media} />
                                          <PlayArrowIcon className="play-icon" />
                                        </>
                                      ) : (
                                        <img
                                          src={media}
                                          alt={`Review media ${index + 1}`}
                                        />
                                      )}
                                    </Box>
                                  ),
                                )}
                              </Box>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </TabPanel>
            </Stack>
          </DialogContent>
        </Dialog>
      ) : null}

      <ImageDetail
        open={!!selectedImage}
        onClose={handleCloseImageDetail}
        currentMedia={selectedImage || ""}
        mediaList={mediaList}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </>
  );
};

export default AdminUserModal;
