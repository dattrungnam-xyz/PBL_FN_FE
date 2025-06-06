import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";
import { toast } from "react-toastify";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { VerifyOCOPStatus } from "../../../enums";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { getVerifyHistory } from "../../../services/verify.service";
import { IVerifyTableData } from "../../../interface/verify.interface";
import TagsList from "../../../components/TagList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useQueryClient } from "@tanstack/react-query";
import { deleteVerify } from "../../../services/verify.service";
import ConfirmDeleteVerifyDialog from "./dialog/ConfirmDeleteVerifyDialog";
import Proof from "../../orders/component/Proof";
import {
  getVerifyOCOPStatusText,
  getVerifyOCOPStatusColor,
} from "../../../utils";

interface TableHeader {
  id: keyof IVerifyTableData | "action" | "star";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: unknown) => string;
}

const tableHeaders: TableHeader[] = [
  { id: "verifyDate", label: "Ngày xác thực", minWidth: 150 },
  { id: "productName", label: "Sản phẩm xác thực", minWidth: 150 },
  { id: "products", label: "Sản phẩm đăng bán", minWidth: 300 },
  { id: "star", label: "Số sao", minWidth: 100, align: "center" },
  { id: "status", label: "Trạng thái", minWidth: 120, align: "center" },
  { id: "createdAt", label: "Ngày tạo", minWidth: 150 },
  { id: "action", label: "Thao tác", minWidth: 100, align: "center" },
];

const VerifyHistory = () => {
  const navigate = useNavigate();
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<VerifyOCOPStatus>(
    VerifyOCOPStatus.ALL,
  );
  const [selectedHistory, setSelectedHistory] =
    useState<IVerifyTableData | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState<{
    file: string;
    index: number;
  } | null>(null);

  const queryClient = useQueryClient();

  const { data: verifyHistory, isLoading } = useQuery({
    queryKey: [
      "verifyHistory",
      user?.storeId,
      page,
      rowsPerPage,
      selectedStatus,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      getVerifyHistory(user?.storeId || "", {
        page: page + 1,
        limit: rowsPerPage,
        status: selectedStatus,
        search: debouncedSearchTerm,
      }),
    enabled: !!user?.storeId,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    try {
      await deleteVerify(id);
      toast.success("Xóa yêu cầu xác thực thành công");
      queryClient.invalidateQueries({ queryKey: ["verifyHistory"] });
    } catch {
      toast.error("Có lỗi xảy ra khi xóa yêu cầu xác thực");
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value as VerifyOCOPStatus);
  };

  const handleOpenModal = (history: IVerifyTableData) => {
    setSelectedHistory(history);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedHistory(null);
    setOpenModal(false);
  };

  const handleOpenProof = (file: string, index: number) => {
    setSelectedProof({ file, index });
  };

  const handleCloseProof = () => {
    setSelectedProof(null);
  };

  return (
    <>
      {isLoading && <CustomBackdrop />}
      <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ color: "text.primary" }}
          >
            Lịch sử xác thực OCOP
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/seller/products/verify")}
            startIcon={<AddIcon />}
          >
            Tạo xác thực
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm theo tên sản phẩm xác thực"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  select
                  size="small"
                  label="Trạng thái"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value={VerifyOCOPStatus.ALL}>Tất cả</MenuItem>
                  <MenuItem value={VerifyOCOPStatus.PENDING}>
                    Chờ xác thực
                  </MenuItem>
                  <MenuItem value={VerifyOCOPStatus.VERIFIED}>
                    Đã xác thực
                  </MenuItem>
                  <MenuItem value={VerifyOCOPStatus.REJECTED}>Từ chối</MenuItem>
                  <MenuItem value={VerifyOCOPStatus.NOT_SUBMITTED}>
                    Chưa xác thực
                  </MenuItem>
                </TextField>
              </Stack>

              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((header) => (
                        <TableCell
                          key={header.id}
                          align={header.align}
                          style={{ minWidth: header.minWidth }}
                        >
                          {header.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {verifyHistory?.data.map((history) => (
                      <TableRow hover key={history.id}>
                        <TableCell>
                          {new Date(history.verifyDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </TableCell>
                        <TableCell>{history.productName}</TableCell>
                        <TableCell>
                          <TagsList
                            items={history.products.map(
                              (product) => product.name,
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <StarIcon
                              sx={{ fontSize: 16, color: "warning.main" }}
                            />
                            <Typography variant="body2">
                              {history.star}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getVerifyOCOPStatusText(history.status)}
                            color={getVerifyOCOPStatusColor(history.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(history.createdAt).toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenModal(history)}
                                sx={{
                                  color: "success.main",
                                  "&:hover": {
                                    bgcolor: "success.lighter",
                                  },
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>

                            {history.status === VerifyOCOPStatus.PENDING && (
                              <>
                                <Tooltip title="Chỉnh sửa">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      navigate(
                                        `/seller/products/verify/${history.id}`,
                                      )
                                    }
                                    sx={{
                                      color: "warning.main",
                                      "&:hover": {
                                        bgcolor: "warning.lighter",
                                      },
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedHistory(history);
                                      setOpenDeleteModal(true);
                                    }}
                                    sx={{
                                      color: "error.main",
                                      "&:hover": {
                                        bgcolor: "error.lighter",
                                      },
                                    }}
                                  >
                                    <DeleteOutlineIcon />
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={verifyHistory?.total || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Modal xem chi tiết */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Chi tiết xác thực OCOP</DialogTitle>
          <DialogContent>
            {selectedHistory && (
              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                {/* Thông tin xác thực */}
                <Card variant="outlined">
                  <CardContent sx={{ p: 1 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Thông tin xác thực
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <TextField
                          label="Số sao OCOP"
                          value={selectedHistory.star}
                          size="small"
                          disabled
                          fullWidth
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <StarIcon sx={{ color: "warning.main" }} />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                        <TextField
                          label="Ngày xác thực"
                          value={new Date(
                            selectedHistory.verifyDate,
                          ).toLocaleDateString("vi-VN")}
                          disabled
                          fullWidth
                          size="small"
                        />
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <TextField
                          label="Trạng thái"
                          value={""}
                          disabled
                          fullWidth
                          size="small"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Chip
                                    label={getVerifyOCOPStatusText(
                                      selectedHistory.status,
                                    )}
                                    color={getVerifyOCOPStatusColor(
                                      selectedHistory.status,
                                    )}
                                    size="small"
                                    sx={{ height: 24 }}
                                  />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                        <TextField
                          label="Tên sản phẩm"
                          value={selectedHistory.productName}
                          disabled
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Đơn vị sản xuất"
                          value={selectedHistory.manufacturer}
                          disabled
                          fullWidth
                          size="small"
                        />
                      </Stack>
                      {selectedHistory.rejectReason && (
                        <TextField
                          label="Lý do từ chối"
                          value={selectedHistory.rejectReason}
                          disabled
                          fullWidth
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Danh sách sản phẩm */}
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Danh sách sản phẩm
                      </Typography>
                      <Stack spacing={0.5}>
                        {selectedHistory.products.map((product) => (
                          <Paper key={product.id} sx={{ p: 0.5 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              {product.images?.[0] && (
                                <Box
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    cursor: "pointer",
                                    "&:hover": {
                                      opacity: 0.8,
                                    },
                                  }}
                                  onClick={() =>
                                    handleOpenProof(product.images[0], 0)
                                  }
                                >
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: 4,
                                    }}
                                  />
                                </Box>
                              )}
                              <Stack spacing={0.5} flex={1}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {product.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="primary"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {product.price.toLocaleString("vi-VN")}đ
                                </Typography>
                              </Stack>
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Hình ảnh minh chứng */}
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Hình ảnh minh chứng
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {selectedHistory.images.map((image, index) => (
                          <Paper
                            key={index}
                            sx={{
                              width: 150,
                              height: 150,
                              overflow: "hidden",
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                              cursor: "pointer",
                              "&:hover": {
                                opacity: 0.8,
                              },
                            }}
                            onClick={() => handleOpenProof(image, index)}
                          >
                            <img
                              src={image}
                              alt={`Certificate ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Paper>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ConfirmDeleteVerifyDialog
        open={openDeleteModal}
        onClose={(confirm) =>
          confirm
            ? handleDelete(selectedHistory?.id || "")
            : setOpenDeleteModal(false)
        }
        keepMounted={false}
      />
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

export default VerifyHistory;
