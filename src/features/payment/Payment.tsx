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
} from "@mui/material";
import { Content } from "../../layouts";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import { useState } from "react";

// Sample data - replace with actual data from cart
const sampleOrderItems = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: 100000,
    image: "",
    quantity: 2,
    store: {
      id: 1,
      name: "Cửa hàng A",
    },
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    price: 150000,
    image: "",
    quantity: 1,
    store: {
      id: 1,
      name: "Cửa hàng A",
    },
  },
];

const paymentMethods = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
  },
  {
    id: "banking",
    name: "Chuyển khoản ngân hàng",
    description: "Thanh toán qua tài khoản ngân hàng",
  },
];

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Calculate totals
  const subtotal = sampleOrderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 30000; // Example shipping fee
  const total = subtotal + shippingFee;

  return (
    <Content>
      <Box sx={{ py: { xs: 1, sm: 1.5, md: 2 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Main Content */}
          <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
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
                  p: { xs: 1.5, sm: 2 },
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

              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    size="small"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    size="small"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    size="small"
                    required
                    multiline
                    rows={2}
                  />
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    size="small"
                    multiline
                    rows={2}
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
                  p: { xs: 1.5, sm: 2 },
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

              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
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
                  p: { xs: 1.5, sm: 2 },
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
                  Đơn hàng ({sampleOrderItems.length} sản phẩm)
                </Typography>

                <Stack spacing={1.5} divider={<Divider />}>
                  {sampleOrderItems.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        variant="square"
                        src={item.image}
                        alt={item.name}
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
                          {item.name}
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
                        {(item.price * item.quantity).toLocaleString()}đ
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Stack spacing={1.5}>
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
                      Tạm tính
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem" }}>
                      {subtotal.toLocaleString()}đ
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
                      {shippingFee.toLocaleString()}đ
                    </Typography>
                  </Box>

                  <Divider />

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
                      {total.toLocaleString()}đ
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
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
  );
};

export default Payment;
