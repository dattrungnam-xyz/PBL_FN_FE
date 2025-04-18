import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Stack,
  Avatar,
  TextField,
  InputAdornment,
  Card,
  Checkbox,
  Tooltip,
} from "@mui/material";
import {
  getOrdersSellerByStatus,
  updateOrderStatus,
  updateOrdersStatus,
} from "../../services/order.service";
import { IOrder, IWard, IDistrict, IProvince } from "../../interface";
import { OrderStatus } from "../../enums";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import OrderDetailModal from "./component/OrderDetailModal";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../../services/location.service";
import LocationFilter from "./component/LocationFilter";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import viLocale from "date-fns/locale/vi";
import ConfirmDialog from "./dialog/ConfirmDialog";
import PaginatedData from "../../types/PaginatedData";
import { useDebounce } from "../../hooks/useDebounce";
interface FilterState {
  province: string;
  district: string;
  ward: string;
  startDate: Date | null;
  endDate: Date | null;
}

const PrepareForShipping = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    province: "all",
    district: "all",
    ward: "all",
    startDate: null,
    endDate: null,
  });
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openConfirmDialogSingle, setOpenConfirmDialogSingle] = useState(false);
  const [orders, setOrders] = useState<PaginatedData<IOrder> | undefined>(
    undefined,
  );
  const [selectedOrderUpdateId, setSelectedOrderUpdateId] = useState<
    string | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, _setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const getOrders = useCallback(async () => {
    const orders = await getOrdersSellerByStatus({
      orderStatus: OrderStatus.PREPARING_FOR_SHIPPING,
      page: page + 1,
      limit: rowsPerPage,
      search: debouncedSearch,
      province: filters.province,
      district: filters.district,
      ward: filters.ward,
      startDate: filters.startDate?.toISOString(),
      endDate: filters.endDate?.toISOString(),
    });
    setOrders(orders);
  }, [filters, page, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    const fetchProvinces = async () => {
      const provinces = await getProvinces();
      setProvinces(provinces);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (filters.province && filters.province !== "all") {
        const districts = await getDistricts(filters.province);
        setDistricts(districts);
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [filters.province]);

  useEffect(() => {
    const fetchWards = async () => {
      if (filters.district && filters.district !== "all") {
        const wards = await getWards(filters.district);
        setWards(wards);
      } else {
        setWards([]);
      }
    };
    fetchWards();
  }, [filters.district]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orders?.data?.map((order) => order.id) || [];
      setSelectedOrders(newSelected);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handlePrepareForShippingSingle = async () => {
    try {
      if (!selectedOrderUpdateId) {
        return;
      }
      await updateOrderStatus(selectedOrderUpdateId, OrderStatus.SHIPPING);
      getOrders();
      setOpenConfirmDialogSingle(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrepareForShipping = async () => {
    try {
      if (selectedOrders.length === 0) {
        return;
      }
      await updateOrdersStatus(selectedOrders, OrderStatus.SHIPPING);
      getOrders();
      setOpenConfirmDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | null,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: date }));
    setPage(0);
  };

  if (loading) return <CustomBackdrop />;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Box sx={{ py: { xs: 0.5, sm: 1, md: 1.5 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 0.5, sm: 1 },
          }}
        >
          {/* Page Title */}
          <Typography
            variant="h4"
            color="text.primary"
            fontWeight={600}
            mb={{ xs: 0.5, sm: 1 }}
          >
            Đơn hàng đang chuẩn bị
          </Typography>
          <Card sx={{ p: 1, mb: 1 }}>
            <Stack spacing={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Tìm kiếm và lọc</Typography>
                {selectedOrders.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LocalShippingIcon />}
                    onClick={() => setOpenConfirmDialog(true)}
                    size="small"
                  >
                    Chuẩn bị giao hàng ({selectedOrders.length})
                  </Button>
                )}
              </Stack>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems="center"
                flexWrap="wrap"
                gap={1}
              >
                <TextField
                  size="small"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ width: 200 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: "1rem" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <DatePicker
                    label="Từ ngày"
                    value={filters.startDate}
                    onChange={(date) => handleDateChange("startDate", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { width: 150 },
                      },
                    }}
                  />
                  <DatePicker
                    label="Đến ngày"
                    value={filters.endDate}
                    onChange={(date) => handleDateChange("endDate", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { width: 150 },
                      },
                    }}
                  />
                </Stack>
                <LocationFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                />
              </Box>
            </Stack>
          </Card>

          {/* Orders Table */}
          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedOrders.length > 0 &&
                          orders?.data &&
                          selectedOrders.length < orders.data.length
                        }
                        checked={
                          orders?.data &&
                          orders.data.length > 0 &&
                          selectedOrders.length === orders.data.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell sx={{ width: "5%" }}>STT</TableCell>
                    <TableCell sx={{ width: "20%" }}>Người mua</TableCell>
                    <TableCell sx={{ width: "30%" }}>Địa chỉ</TableCell>
                    <TableCell sx={{ width: "20%" }}>Thời gian</TableCell>
                    <TableCell sx={{ width: "10%" }}>Tổng tiền</TableCell>
                    <TableCell sx={{ width: "20%" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.data?.map((order: IOrder, index: number) => (
                    <TableRow key={order.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.813rem" },
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {page * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            variant="square"
                            src={order.user.avatar}
                            alt={order.user.name}
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
                            {order.user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                              }}
                            >
                              {order.user.name}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.813rem" },
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {order.address.textAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.813rem" },
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: "0.75rem" }} />
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "0.938rem" },
                            fontWeight: 600,
                            color: "primary.main",
                          }}
                        >
                          {order.totalPrice.toLocaleString()}đ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Chi tiết">
                            <VisibilityIcon
                              fontSize="small"
                              onClick={() => {
                                setSelectedOrder(order);
                                setOpen(true);
                              }}
                              sx={{
                                cursor: "pointer",
                                color: "primary.main",
                                "&:hover": {
                                  color: "primary.dark",
                                },
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Giao hàng">
                            <LocalShippingIcon
                              fontSize="small"
                              onClick={() => {
                                setSelectedOrderUpdateId(order.id);
                                setOpenConfirmDialogSingle(true);
                              }}
                              sx={{
                                cursor: "pointer",
                                color: "primary.main",
                                "&:hover": {
                                  color: "primary.dark",
                                },
                              }}
                            />
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders?.total || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Box>
      <OrderDetailModal
        open={open}
        onClose={() => setOpen(false)}
        order={selectedOrder}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={(confirm) =>
          confirm ? handlePrepareForShipping() : setOpenConfirmDialog(false)
        }
        keepMounted={false}
        title="Chuẩn bị giao hàng"
        content="Bạn có chắc chắn muốn chuẩn bị giao hàng cho các đơn hàng này?"
        confirmText="Chuẩn bị giao hàng"
        cancelText="Hủy bỏ"
      />

      <ConfirmDialog
        open={openConfirmDialogSingle}
        onClose={(confirm) =>
          confirm
            ? handlePrepareForShippingSingle()
            : setOpenConfirmDialogSingle(false)
        }
        keepMounted={false}
        title="Chuẩn bị giao hàng"
        content="Bạn có chắc chắn muốn chuẩn bị giao hàng cho đơn hàng này?"
        confirmText="Chuẩn bị giao hàng"
        cancelText="Hủy bỏ"
      />
    </LocalizationProvider>
  );
};

export default PrepareForShipping;
