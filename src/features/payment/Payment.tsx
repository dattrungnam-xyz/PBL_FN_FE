import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Avatar,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Content } from "../../layouts";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import { getCartCheckOut } from "../../services/cart.service";
import {
  createUserAddress,
  getUserAddresses,
} from "../../services/userAddress.service";
import {
  ICartGroupByStore,
  ICreateUserAddress,
  IUserAddress,
  ICreateOrder,
} from "../../interface";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import AddressDialog from "../profile/AddressDialog";
import { PaymentMethod } from "../../enums";
import { createOrders } from "../../services/order.service";

const paymentMethods = [
  {
    id: PaymentMethod.CASH_ON_DELIVERY,
    name: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
  },
  {
    id: PaymentMethod.BANK_TRANSFER,
    name: "Chuyển khoản ngân hàng",
    description: "Thanh toán qua tài khoản ngân hàng",
  },
];

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH_ON_DELIVERY,
  );
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [shippingAddressError, setShippingAddressError] = useState<string>("");
  const [note, setNote] = useState("");
  const [cartItems, setCartItems] = useState<ICartGroupByStore[]>([]);
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<IUserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createAddressMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Thêm địa chỉ thành công");
      fetchUserAddresses();
      setOpen(false);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi thêm địa chỉ");
    },
  });

  useEffect(() => {
    const selectedItems = JSON.parse(
      localStorage.getItem("selectedItems") || "[]",
    );

    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await getCartCheckOut(selectedItems);
        setCartItems(response || []);
        localStorage.removeItem("selectedItems");
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi lấy giỏ hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    const response = await getUserAddresses();
    setAddresses(response || []);
  };

  if (loading) {
    return (
      <Content>
        <CustomBackdrop />
      </Content>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Content>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>Giỏ hàng trống</Typography>
        </Box>
      </Content>
    );
  }

  const storeTotals = cartItems.map((store) => ({
    storeId: store.seller.id,
    storeName: store.seller.name,
    subtotal: store.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
    shippingFee: 30000,
    total: 0,
    items: store.items,
  }));

  const totalPrice = storeTotals.reduce(
    (sum, store) => sum + store.subtotal + store.shippingFee,
    0,
  );

  const handleSubmit = async () => {
    if (!shippingAddress) {
      setShippingAddressError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    try {
      const orders: ICreateOrder[] = [];
      storeTotals.forEach((store) => {
        const order: ICreateOrder = {
          addressId: shippingAddress,
          note,
          shippingFee: store.shippingFee,
          totalPrice: store.subtotal + store.shippingFee,
          sellerId: store.storeId,
          paymentMethod,
          orderDetails: store.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        };
        orders.push(order);
      });
      await createOrders(orders);
      toast.success("Đặt hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng");
    }
  };

  const handleCreateAddress = (address: ICreateUserAddress) => {
    createAddressMutation.mutate(address);
  };

  return (
    <>
      <Content>
        <Box sx={{ py: { xs: 0.5, sm: 1, md: 1.5 } }}>
          <Box
            sx={{
              maxWidth: 1200,
              mx: "auto",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: { xs: 0.5, sm: 1, md: 1.5 },
              px: { xs: 0.5, sm: 1 },
            }}
          >
            {/* Main Content */}
            <Stack spacing={{ xs: 0.5, sm: 1, md: 1.5 }}>
              {/* Delivery Information */}
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    p: { xs: 0.5, sm: 1 },
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalShippingOutlinedIcon color="primary" />
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      fontWeight: 600,
                    }}
                  >
                    Thông tin giao hàng
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Stack spacing={1}>
                    <FormControl fullWidth error={!!shippingAddressError}>
                      <Select
                        value={shippingAddress}
                        onChange={(e) => {
                          setShippingAddress(e.target.value);
                          setShippingAddressError("");
                        }}
                        displayEmpty
                        size="small"
                        required
                      >
                        <MenuItem value="" disabled>
                          Chọn địa chỉ giao hàng
                        </MenuItem>
                        {addresses?.map((address) => (
                          <MenuItem key={address.id} value={address.id}>
                            {`${address.name} - ${address.phone} - ${address.textAddress}`}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ p: 0, minWidth: 0 }}
                          onClick={() => setOpen(true)}
                        >
                          + Thêm địa chỉ mới
                        </Button>
                      </FormHelperText>
                      {shippingAddressError && (
                        <FormHelperText>{shippingAddressError}</FormHelperText>
                      )}
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Ghi chú"
                      size="small"
                      multiline
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    />
                  </Stack>
                </Box>
              </Paper>

              {/* Payment Methods */}
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    p: { xs: 0.5, sm: 1 },
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PaymentOutlinedIcon color="primary" />
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      fontWeight: 600,
                    }}
                  >
                    Phương thức thanh toán
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                    >
                      <Stack spacing={1}>
                        {paymentMethods.map((method) => (
                          <Paper
                            key={method.id}
                            elevation={0}
                            sx={{
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 1,
                            }}
                          >
                            <FormControlLabel
                              value={method.id}
                              control={<Radio />}
                              label={
                                <Box sx={{ py: 0.5 }}>
                                  <Typography
                                    sx={{
                                      fontSize: "0.875rem",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {method.name}
                                  </Typography>
                                  <Typography
                                    color="text.secondary"
                                    sx={{ fontSize: "0.813rem" }}
                                  >
                                    {method.description}
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                mx: 0,
                                px: 1.5,
                                width: "100%",
                              }}
                            />
                          </Paper>
                        ))}
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Paper>
            </Stack>

            {/* Order Summary */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  position: { md: "sticky" },
                  top: { md: 24 },
                }}
              >
                <Box
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    Đơn hàng (
                    {cartItems.reduce(
                      (sum, store) => sum + store.items.length,
                      0,
                    )}{" "}
                    sản phẩm)
                  </Typography>

                  <Stack spacing={2}>
                    {cartItems.map((store) => (
                      <Box key={store.seller.id}>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {store.seller.name}
                        </Typography>
                        <Stack spacing={1.5} divider={<Divider />}>
                          {store.items.map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: "flex",
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                variant="square"
                                src={item.product.images[0]}
                                alt={item.product.name}
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: "grey.300",
                                  fontSize: "1rem",
                                }}
                              >
                                S
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontSize: "0.875rem",
                                    mb: 0.5,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.product.name}
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  sx={{ fontSize: "0.813rem" }}
                                >
                                  SL: {item.quantity}
                                </Typography>
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString()}
                                đ
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Stack spacing={1.5}>
                    {storeTotals.map((store) => (
                      <Box key={store.storeId}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Tạm tính ({store.storeName})
                          </Typography>
                          <Typography sx={{ fontSize: "0.875rem" }}>
                            {store.subtotal.toLocaleString()}đ
                          </Typography>
                        </Box>

                        {/* Discount Code Input - Hidden for now */}
                        <Box
                          sx={{
                            display: "none", // Will be shown when discount feature is implemented
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Nhập mã giảm giá"
                            sx={{ flex: 1 }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              whiteSpace: "nowrap",
                              minWidth: "fit-content",
                            }}
                          >
                            Áp dụng
                          </Button>
                        </Box>

                        {/* Discount Display - Hidden for now */}
                        <Box
                          sx={{
                            display: "none", // Will be shown when discount is applied
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Giảm giá
                          </Typography>
                          <Typography
                            color="error"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            -0đ
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Phí vận chuyển
                          </Typography>
                          <Typography sx={{ fontSize: "0.875rem" }}>
                            {store.shippingFee.toLocaleString()}đ
                          </Typography>
                        </Box>

                        {/* Store Total - Will include discount in the future */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                            }}
                          >
                            Tổng ({store.storeName})
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                            }}
                          >
                            {(
                              store.subtotal + store.shippingFee
                            ).toLocaleString()}
                            đ
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))}

                    {/* Grand Total */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        Tổng cộng
                      </Typography>
                      <Typography
                        color="primary"
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 600,
                        }}
                      >
                        {totalPrice.toLocaleString()}đ
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleSubmit}
                      sx={{
                        mt: 1,
                        py: 1,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      Đặt hàng
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Content>
      <AddressDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateAddress}
      />
    </>
  );
};

export default Payment;
