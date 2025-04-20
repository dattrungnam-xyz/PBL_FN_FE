import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { useState } from "react";
import format from "date-fns/format";
import { blockUser, getUsers, unblockUser } from "../../services/user.service";
import { formatPrice } from "../../utils";
import { OrderStatus } from "../../enums";
import AdminUserModal from "./component/AdminUserModal";
import DynamicDialog from "../../components/DynamicDialog";
import { Check } from "@mui/icons-material";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface FilterState {
  search: string;
  isActive: boolean;
}

const AdminUser = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    isActive: true,
  });

  const [open, setOpen] = useState(false);
  const [openConfirmBlock, setOpenConfirmBlock] = useState(false);
  const [openConfirmUnblock, setOpenConfirmUnblock] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data: users } = useQuery({
    queryKey: ["getUsers", page, rowsPerPage, filters.search, filters.isActive],
    queryFn: () =>
      getUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: filters.search,
        isActive: filters.isActive,
      }),
  });

  const handleFilterChange = (
    field: keyof FilterState,
    value: string | boolean | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleBlockUser = async () => {
    if (!selectedUserId) return;
    try {
      setIsLoading(true);
      await blockUser(selectedUserId);
      setIsLoading(false);
      queryClient.invalidateQueries({
        queryKey: [
          "getUsers",
          page,
          rowsPerPage,
          filters.search,
          filters.isActive,
        ],
      });
      toast.success("Khóa tài khoản thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setOpenConfirmBlock(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUserId) return;
    try {
      setIsLoading(true);
      await unblockUser(selectedUserId);
      queryClient.invalidateQueries({
        queryKey: [
          "getUsers",
          page,
          rowsPerPage,
          filters.search,
          filters.isActive,
        ],
      });
      toast.success("Mở khóa tài khoản thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setOpenConfirmUnblock(false);
    }
  };

  return (
    <>
      {isLoading ? <CustomBackdrop /> : null}
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h5" color="text.primary" fontWeight={600}>
            Danh sách người dùng
          </Typography>
        </Stack>

        <Card>
          <Stack spacing={1} sx={{ p: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Tìm kiếm người dùng..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{ fontSize: 20, color: "text.disabled" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ width: 280 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.isActive}
                    onChange={() =>
                      handleFilterChange("isActive", !filters.isActive)
                    }
                    sx={{
                      color: "error.main",
                      "&.Mui-checked": {
                        color: "error.main",
                      },
                    }}
                  />
                }
                label="Bị khóa"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      STT
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Họ tên
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Cửa hàng
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Số điện thoại
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Đơn đã đặt
                    </TableCell>

                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Tổng chi tiêu
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Ngày tạo
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.data?.map((user, index) => (
                    <TableRow key={user.id} hover>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          py: 0.25,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Avatar
                            src={user?.avatar}
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                            }}
                          />
                          <Typography variant="inherit">{user.name}</Typography>
                        </Stack>
                      </TableCell>
                      {user.seller ? (
                        <>
                          <TableCell
                            sx={{
                              fontSize: "0.75rem",
                              py: 0.25,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Avatar
                                src={user?.seller?.avatar}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1,
                                }}
                              />
                              <Typography variant="inherit">
                                {user?.seller?.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                        </>
                      ) : (
                        <TableCell
                          sx={{
                            fontSize: "0.75rem",
                            py: 0.25,
                          }}
                        >
                          <Typography variant="inherit">-</Typography>
                        </TableCell>
                      )}

                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {user.email}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {user.phone}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {user.orders.length}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {formatPrice(
                          user.orders
                            ?.filter(
                              (order) =>
                                order.orderStatus !== OrderStatus.REFUNDED &&
                                order.orderStatus !== OrderStatus.CANCELLED &&
                                order.orderStatus !== OrderStatus.REJECTED,
                            )
                            ?.reduce(
                              (acc, order) =>
                                acc + order.totalPrice - order.shippingFee,
                              0,
                            ),
                        )}
                      </TableCell>

                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {format(new Date(user.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {user.isActive ? (
                          <Chip label="Hoạt động" color="success" />
                        ) : (
                          <Chip label="Khóa" color="error" />
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 0.25 }}>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              color="primary"
                              sx={{
                                "&:hover": {
                                  bgcolor: "primary.lighter",
                                },
                              }}
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setOpen(true);
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          {user.isActive ? (
                            <>
                              <Tooltip title="Khóa tài khoản">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    setOpenConfirmBlock(true);
                                  }}
                                  sx={{
                                    "&:hover": {
                                      bgcolor: "error.lighter",
                                    },
                                  }}
                                >
                                  <BlockRoundedIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Mở khóa tài khoản">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    setOpenConfirmUnblock(true);
                                  }}
                                  sx={{
                                    "&:hover": {
                                      bgcolor: "success.lighter",
                                    },
                                  }}
                                >
                                  <Check sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={users?.total || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Hiển thị:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} trên ${count}`
              }
              sx={{
                ".MuiTablePagination-select": {
                  fontSize: "0.75rem",
                },
                ".MuiTablePagination-displayedRows": {
                  fontSize: "0.75rem",
                },
                ".MuiTablePagination-selectLabel": {
                  fontSize: "0.75rem",
                },
              }}
            />
          </Stack>
        </Card>
      </Box>
      <AdminUserModal
        open={open}
        onClose={() => setOpen(false)}
        userId={selectedUserId}
      />
      <DynamicDialog
        open={openConfirmBlock}
        keepMounted={false}
        onClose={(confirm) => {
          if (confirm) {
            handleBlockUser();
          } else {
            setOpenConfirmBlock(false);
          }
        }}
        title="Khóa tài khoản"
        content="Bạn có chắc chắn muốn khóa tài khoản này không?"
        confirmText="Khóa tài khoản"
        cancelText="Hủy bỏ"
        type="error"
      />
      <DynamicDialog
        open={openConfirmUnblock}
        keepMounted={false}
        onClose={(confirm) => {
          if (confirm) {
            handleUnblockUser();
          } else {
            setOpenConfirmUnblock(false);
          }
        }}
        title="Mở khóa tài khoản"
        content="Bạn có chắc chắn muốn mở khóa tài khoản này không?"
        confirmText="Mở khóa tài khoản"
        type="confirm"
        cancelText="Hủy bỏ"
      />
    </>
  );
};

export default AdminUser;
