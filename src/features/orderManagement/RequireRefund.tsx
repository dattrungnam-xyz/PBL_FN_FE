import React, { useCallback, useEffect, useState } from "react";
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
  Stack,
  Avatar,
  TextField,
  InputAdornment,
  Card,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import {
  getOrdersSellerByStatus,
  acceptRefundOrder,
  rejectRefundOrder,
} from "../../services/order.service";
import { IOrder, IWard, IDistrict, IProvince } from "../../interface";
import { OrderStatus } from "../../enums";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../../services/location.service";
import LocationFilter from "./component/LocationFilter";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import viLocale from "date-fns/locale/vi";
import PaginatedData from "../../types/PaginatedData";
import { useDebounce } from "../../hooks/useDebounce";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import OrderRefundModal from "./component/OrderRefundModal";
import ConfirmDialog from "./dialog/ConfirmDialog";
import { toast } from "react-toastify";
import RejectRefundModal from "./component/RejectRefundModal";
interface FilterState {
  province: string;
  district: string;
  ward: string;
  startDate: Date | null;
  endDate: Date | null;
}

const RequireRefund = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
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
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<PaginatedData<IOrder> | undefined>(
    undefined,
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [openReject, setOpenReject] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
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

  const getOrders = useCallback(async () => {
    const orders = await getOrdersSellerByStatus({
      orderStatus: OrderStatus.REQUIRE_REFUND,
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

  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | null,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: date }));
    setPage(0);
  };

  const handleAcceptRefund = async () => {
    if (confirmOrderId) {
      try {
        setLoading(true);
        await acceptRefundOrder(confirmOrderId);
        queryClient.invalidateQueries({ queryKey: ["pending-orders"] });
        setOpenConfirm(false);
        setConfirmOrderId(null);
        toast.success("Phê duyệt yêu cầu trả hàng thành công");
        getOrders();
      } catch (error) {
        console.error(error);
        toast.error("Phê duyệt yêu cầu trả hàng thất bại");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRejectRefund = async (reason: string) => {
    if (rejectOrderId) {
      try {
        setLoading(true);
        await rejectRefundOrder(rejectOrderId, reason);
        queryClient.invalidateQueries({ queryKey: ["pending-orders"] });
        setOpenReject(false);
        setRejectOrderId(null);
        toast.success("Từ chối yêu cầu trả hàng thành công");
        getOrders();
      } catch (error) {
        console.error(error);
        toast.error("Từ chối yêu cầu trả hàng thất bại");
      } finally {
        setLoading(false);
      }
    }
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
            Đơn hàng yêu cầu hoàn hàng
          </Typography>
          <Card sx={{ p: 1, mb: 1 }}>
            <Stack spacing={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Tìm kiếm và lọc</Typography>
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
                    <TableCell sx={{ width: "5%" }}>STT</TableCell>
                    <TableCell sx={{ width: "20%" }}>Người mua</TableCell>
                    <TableCell sx={{ width: "20%" }}>Địa chỉ</TableCell>
                    <TableCell sx={{ width: "20%" }}>Thời gian</TableCell>
                    <TableCell sx={{ width: "20%" }}>Tổng tiền</TableCell>
                    <TableCell sx={{ width: "20%" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.data?.map((order: IOrder, index: number) => (
                    <TableRow key={order.id}>
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
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Xem chi tiết yêu cầu">
                            <IconButton
                              size="small"
                              color="inherit"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                                height: { xs: 24, sm: 28 },
                                width: { xs: 24, sm: 28 },
                              }}
                              onClick={() => {
                                setSelectedOrder(order);
                                setOpen(true);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Từ chối yêu cầu">
                            <IconButton
                              size="small"
                              color="error"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                                height: { xs: 24, sm: 28 },
                                width: { xs: 24, sm: 28 },
                              }}
                              onClick={() => {
                                setSelectedOrder(order);
                                setOpenReject(true);
                                setRejectOrderId(order.id);
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chấp nhận yêu cầu">
                            <IconButton
                              size="small"
                              color="success"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                                height: { xs: 24, sm: 28 },
                                width: { xs: 24, sm: 28 },
                              }}
                              onClick={() => {
                                setConfirmOrderId(order.id);
                                setOpenConfirm(true);
                              }}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
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
      <OrderRefundModal
        open={open}
        onClose={() => setOpen(false)}
        order={selectedOrder!}
        onAccept={handleAcceptRefund}
        onReject={handleRejectRefund}
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={(confirm) =>
          confirm ? handleAcceptRefund() : setOpenConfirm(false)
        }
        title="Xác nhận phê duyệt yêu cầu"
        content="Bạn có chắc chắn muốn phê duyệt yêu cầu hoàn tiền đơn hàng này không?"
        confirmText="Phê duyệt"
        cancelText="Hủy bỏ"
        keepMounted={false}
      />
      <RejectRefundModal
        open={openReject}
        onClose={() => setOpenReject(false)}
        order={selectedOrder!}
        onReject={handleRejectRefund}
      />
    </LocalizationProvider>
  );
};

export default RequireRefund;
