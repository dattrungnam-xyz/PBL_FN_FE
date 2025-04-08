import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Divider,
  Paper,
  Avatar,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Content } from "../../layouts";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState, useEffect } from "react";
import { getCart } from "../../services/cart.service";
import { ICartGroupByStore } from "../../interface";
import {
  removeCartItem,
  updateCartItem,
} from "../../services/cartItems.service";

const Cart = () => {
  const [cartItems, setCartItems] = useState<ICartGroupByStore[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = async () => {
      const response = await getCart();
      setCartItems(response || []);
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (id: number | string, delta: number) => {
    const item = cartItems
      .flatMap((item) => item.items)
      .find((item) => item.id === id);

    if (item) {
      if (item.quantity + delta > item.product.quantity) {
        toast.error(
          `Số lượng sản phẩm không đủ, còn tối đa ${item.product.quantity} sản phẩm`,
        );
        return;
      }
    }
    try {
      await updateCartItem(id, item!.quantity + delta);
      setCartItems((prev) =>
        prev.map((item) =>
          item.items.some((item) => item.id === id)
            ? {
                ...item,
                items: item.items.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        quantity: Math.max(1, item.quantity + delta),
                      }
                    : item,
                ),
              }
            : item,
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi cập nhật số lượng sản phẩm");
    }
  };

  const handleRemoveItem = async (id: number | string) => {
    try {
      await removeCartItem(id);
      setCartItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            items: item.items.filter((item) => item.id !== id),
          }))
          .filter((item) => item.items.length > 0),
      );
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSelectStore = (storeItems: ICartGroupByStore) => {
    const storeItemIds = storeItems.items.map((item) => item.id);
    const allSelected = storeItemIds.every((id) => selectedItems.includes(id));

    if (allSelected) {
      setSelectedItems((prev) =>
        prev.filter((id) => !storeItemIds.includes(id)),
      );
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...storeItemIds])]);
    }
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === cartItems.flatMap((item) => item.items).length
        ? []
        : cartItems.flatMap((item) => item.items).map((item) => item.id),
    );
  };

  const handleCheckout = async () => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    navigate("/payment");
  };

  const subtotal = (cartItems || [])
    .flatMap((item) => item.items)
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;

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
          {/* Cart Items */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: { xs: 0.5, sm: 1 },
                minHeight: 40,
              }}
            >
              {cartItems?.length > 0 && (
                <Checkbox
                  size={window.innerWidth < 600 ? "small" : "medium"}
                  checked={
                    selectedItems.length ===
                    cartItems.flatMap((item) => item.items).length
                  }
                  indeterminate={
                    selectedItems.length > 0 &&
                    selectedItems.length <
                      cartItems.flatMap((item) => item.items).length
                  }
                  onChange={handleSelectAll}
                />
              )}
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  fontWeight: 700,
                }}
              >
                Giỏ hàng ({cartItems?.flatMap((item) => item.items).length})
              </Typography>
            </Box>

            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              {cartItems.map((group) => (
                <Paper
                  key={group.seller.id}
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  {/* Store Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: { xs: 0.5, sm: 1 },
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Checkbox
                      size={window.innerWidth < 600 ? "small" : "medium"}
                      checked={group.items.every((item) =>
                        selectedItems.includes(item.id),
                      )}
                      indeterminate={
                        group.items.some((item) =>
                          selectedItems.includes(item.id),
                        ) &&
                        !group.items.every((item) =>
                          selectedItems.includes(item.id),
                        )
                      }
                      onChange={() => handleSelectStore(group)}
                    />
                    <Stack direction="row" alignItems="center" gap={0.25}>
                      <img
                        src={group.seller.avatar}
                        alt={group.seller.name}
                        style={{ width: 32, height: 32 }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          fontWeight: 600,
                        }}
                      >
                        {group.seller.name}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Store Items */}
                  <Stack divider={<Divider />}>
                    {group.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: { xs: 0.5, sm: 1 },
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            size={window.innerWidth < 600 ? "small" : "medium"}
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                          {/* Product Image */}
                          <Avatar
                            variant="square"
                            src={item.product.images[0]}
                            alt={item.product.name}
                            sx={{
                              width: { xs: 60, sm: 80 },
                              height: { xs: 60, sm: 80 },
                              bgcolor: "grey.300",
                              fontSize: { xs: "1.5rem", sm: "2rem" },
                            }}
                          >
                            S
                          </Avatar>

                          {/* Product Details */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontSize: { xs: "0.875rem", sm: "0.938rem" },
                                fontWeight: 500,
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.product.name}
                            </Typography>

                            <Typography
                              color="primary"
                              sx={{
                                fontSize: { xs: "0.875rem", sm: "0.938rem" },
                                fontWeight: 600,
                                mb: 0.5,
                              }}
                            >
                              {item.product.price.toLocaleString()}đ
                            </Typography>

                            <Typography
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                                mb: 0.5,
                              }}
                            >
                              Tổng:{" "}
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString()}
                              đ
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: { xs: 1, sm: 1.5 },
                              }}
                            >
                              {/* Quantity Controls */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                sx={{
                                  border: 1,
                                  borderColor: "divider",
                                  borderRadius: 1,
                                  height: 32,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleQuantityChange(item.id, -1)
                                  }
                                  disabled={item.quantity <= 1}
                                  sx={{
                                    p: 0.5,
                                    borderRadius: 0,
                                    borderRight: 1,
                                    borderColor: "divider",
                                  }}
                                >
                                  <RemoveIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                                <Typography
                                  sx={{
                                    width: 32,
                                    textAlign: "center",
                                    userSelect: "none",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleQuantityChange(item.id, 1)
                                  }
                                  disabled={item.quantity >= 99}
                                  sx={{
                                    p: 0.5,
                                    borderRadius: 0,
                                    borderLeft: 1,
                                    borderColor: "divider",
                                  }}
                                >
                                  <AddIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                              </Stack>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  color="primary"
                                  sx={{
                                    fontSize: {
                                      xs: "0.875rem",
                                      sm: "0.938rem",
                                    },
                                    fontWeight: 600,
                                  }}
                                >
                                  {(
                                    item.product.price * item.quantity
                                  ).toLocaleString()}
                                  đ
                                </Typography>

                                {/* Remove Button */}
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveItem(item.id)}
                                  sx={{
                                    p: 0.5,
                                    color: "text.secondary",
                                  }}
                                >
                                  <DeleteOutlineIcon
                                    sx={{ fontSize: "1.25rem" }}
                                  />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>

            {cartItems?.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  textAlign: "center",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.813rem", sm: "0.875rem" },
                  }}
                >
                  Giỏ hàng của bạn đang trống
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Order Summary */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                position: { md: "sticky" },
                top: { md: 24 },
                mt: { xs: 1, sm: 1.5, md: 2 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: 600,
                  color: "text.primary",
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Tổng tiền ({selectedItems.length} sản phẩm)
              </Typography>

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
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {total.toLocaleString()}đ
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={selectedItems.length === 0}
                  onClick={handleCheckout}
                  sx={{
                    mt: 1,
                    py: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  Thanh toán ({selectedItems.length})
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Content>
  );
};

export default Cart;
