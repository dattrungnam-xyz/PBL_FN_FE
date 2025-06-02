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
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { IVerifyTableData } from "../../interface/verify.interface";
import { VerifyOCOPStatus } from "../../enums";
import {
  approveVerify,
  deleteVerify,
  getVerify,
  rejectVerify,
  getVerifyById,
} from "../../services/verify.service";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import TagsList from "../../components/TagList";
import ConfirmDeleteVerifyDialog from "../productVerifyManagement/seller/dialog/ConfirmDeleteVerifyDialog";
import ImageDetail from "../../components/ImageDetail";
import { getVerifyOCOPStatusText, getVerifyOCOPStatusColor } from "../../utils";
import { getStores } from "../../services/store.service";
import ProductDetailModal from "../productManagement/component/ProductDetailModal";
import DynamicDialog from "../../components/DynamicDialog";
import RejectVerifyModal from "./component/RejectVerifyModal";
import { Check, Close } from "@mui/icons-material";
import { IProduct } from "../../interface";

interface TableHeader {
  id: keyof IVerifyTableData | "action" | "star" | "seller";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: unknown) => string;
}

const tableHeaders: TableHeader[] = [
  { id: "verifyDate", label: "Ngày xác thực", minWidth: 150 },
  { id: "productName", label: "Sản phẩm xác thực", minWidth: 150 },
  { id: "products", label: "Sản phẩm đăng bán", minWidth: 300 },
  { id: "seller", label: "Cửa hàng", minWidth: 300 },
  { id: "star", label: "Số sao", minWidth: 100, align: "center" },
  { id: "status", label: "Trạng thái", minWidth: 120, align: "center" },
  { id: "createdAt", label: "Ngày tạo", minWidth: 150 },
  { id: "action", label: "Thao tác", minWidth: 100, align: "center" },
];

const VerifyHistory = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedHistory, setSelectedHistory] =
    useState<IVerifyTableData | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState<{
    file: string;
    index: number;
  } | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>("all");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [openProductDetailModal, setOpenProductDetailModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const { data: verifyHistory, isLoading } = useQuery({
    queryKey: [
      "verifyHistoryAdmin",
      selectedStoreId,
      page,
      rowsPerPage,
      status,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      getVerify({
        page: page + 1,
        limit: rowsPerPage,
        status: status as VerifyOCOPStatus,
        search: debouncedSearchTerm,
        storeId: selectedStoreId,
      }),
  });

  const { data: verifyHistoryDetail } = useQuery({
    queryKey: ["verifyHistoryDetail", selectedHistory?.id],
    queryFn: () => {
      if (!selectedHistory?.id) {
        throw new Error("No history ID selected");
      }
      return getVerifyById(selectedHistory.id);
    },
    enabled: !!selectedHistory?.id,
  });

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: () =>
      getStores({
        page: 1,
        limit: 1000,
        search: "",
        province: "",
        district: "",
        ward: "",
      }),
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
      queryClient.invalidateQueries({
        queryKey: [
          "verifyHistoryAdmin",
          selectedStoreId,
          page,
          rowsPerPage,
          status,
          debouncedSearchTerm,
        ],
      });
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

  const handleStoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStoreId(event.target.value);
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

  const handleOpenProductDetailModal = (productId: string) => {
    setSelectedProductId(productId);
    setOpenProductDetailModal(true);
  };

  const handleApprove = async () => {
    if (!selectedHistory?.id) {
      toast.error("Không tìm thấy yêu cầu xác thực");
      return;
    }
    try {
      await approveVerify(selectedHistory?.id);
      toast.success("Phê duyệt xác thực thành công");
      queryClient.invalidateQueries({
        queryKey: [
          "verifyHistoryAdmin",
          selectedStoreId,
          page,
          rowsPerPage,
          status,
          debouncedSearchTerm,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["verifyHistoryDetail", selectedHistory?.id],
      });
    } catch {
      toast.error("Có lỗi xảy ra khi phê duyệt xác thực");
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedHistory?.id) {
      toast.error("Không tìm thấy yêu cầu xác thực");
      return;
    }
    try {
      await rejectVerify(selectedHistory?.id, reason);
      toast.success("Từ chối xác thực thành công");
      queryClient.invalidateQueries({
        queryKey: [
          "verifyHistoryAdmin",
          selectedStoreId,
          page,
          rowsPerPage,
          status,
          debouncedSearchTerm,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["verifyHistoryDetail", selectedHistory?.id],
      });
    } catch {
      toast.error("Có lỗi xảy ra khi từ chối xác thực");
    }
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
                  label="Cửa hàng"
                  value={selectedStoreId}
                  onChange={handleStoreChange}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value={"all"}>Tất cả</MenuItem>
                  {stores?.data.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
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
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            py: 0.25,
                          }}
                        >
                          {header.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {verifyHistory?.data?.map((history) => (
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
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Avatar
                              src={history?.products[0]?.seller?.avatar}
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                              }}
                            />
                            <Typography variant="inherit">
                              {history?.products[0]?.seller?.name}
                            </Typography>
                          </Stack>
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
                                <Tooltip title="Phê duyệt">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedHistory(history);
                                      setOpenApproveModal(true);
                                    }}
                                    sx={{
                                      color: "success.main",
                                      "&:hover": {
                                        bgcolor: "success.lighter",
                                      },
                                    }}
                                  >
                                    <Check />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Từ chối">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedHistory(history);
                                      setOpenRejectModal(true);
                                    }}
                                    sx={{
                                      color: "error.main",
                                      "&:hover": {
                                        bgcolor: "error.lighter",
                                      },
                                    }}
                                  >
                                    <Close />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {history.status === VerifyOCOPStatus.REJECTED && (
                              <>
                                <Tooltip title="Phê duyệt">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedHistory(history);
                                      setOpenApproveModal(true);
                                    }}
                                    sx={{
                                      color: "success.main",
                                      "&:hover": {
                                        bgcolor: "success.lighter",
                                      },
                                    }}
                                  >
                                    <Check />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {history.status === VerifyOCOPStatus.VERIFIED && (
                              <>
                                <Tooltip title="Từ chối">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedHistory(history);
                                      setOpenRejectModal(true);
                                    }}
                                    sx={{
                                      color: "error.main",
                                      "&:hover": {
                                        bgcolor: "error.lighter",
                                      },
                                    }}
                                  >
                                    <Close />
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
            {verifyHistoryDetail && (
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
                          value={verifyHistoryDetail?.star}
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
                            verifyHistoryDetail?.verifyDate,
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
                                      verifyHistoryDetail?.status,
                                    )}
                                    color={getVerifyOCOPStatusColor(
                                      verifyHistoryDetail?.status,
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
                          value={verifyHistoryDetail?.productName}
                          disabled
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Đơn vị sản xuất"
                          value={verifyHistoryDetail?.manufacturer}
                          disabled
                          fullWidth
                          size="small"
                        />
                      </Stack>
                      {verifyHistoryDetail?.rejectReason && (
                        <TextField
                          label="Lý do từ chối"
                          value={verifyHistoryDetail?.rejectReason}
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
                        {verifyHistoryDetail?.products.map(
                          (product: IProduct) => (
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
                                <Stack
                                  onClick={() =>
                                    handleOpenProductDetailModal(product.id)
                                  }
                                  spacing={0.5}
                                  flex={1}
                                >
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
                          ),
                        )}
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
                        {verifyHistoryDetail?.images?.map(
                          (image: string, index: number) => (
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
                          ),
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            {selectedHistory?.status === VerifyOCOPStatus.PENDING ||
            selectedHistory?.status === VerifyOCOPStatus.REJECTED ? (
              <Button
                onClick={() => setOpenApproveModal(true)}
                variant="contained"
                color="success"
              >
                Phê duyệt
              </Button>
            ) : null}
            {selectedHistory?.status === VerifyOCOPStatus.PENDING ||
            selectedHistory?.status === VerifyOCOPStatus.VERIFIED ? (
              <Button
                onClick={() => setOpenRejectModal(true)}
                variant="contained"
                color="error"
              >
                Từ chối
              </Button>
            ) : null}

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
        <ImageDetail
          open={true}
          onClose={handleCloseProof}
          currentMedia={selectedProof.file}
          mediaList={[selectedProof.file]}
          onNext={() => {}}
          onPrev={() => {}}
        />
      )}
      {selectedProductId && (
        <ProductDetailModal
          open={openProductDetailModal}
          onClose={() => setOpenProductDetailModal(false)}
          productId={selectedProductId}
        />
      )}
      <DynamicDialog
        open={openApproveModal}
        onClose={(confirm) => {
          if (confirm) {
            handleApprove();
          }
          setOpenApproveModal(false);
        }}
        title="Phê duyệt"
        content="Bạn có chắc chắn muốn phê duyệt xác thực này không?"
        keepMounted={false}
        confirmText="Phê duyệt"
        cancelText="Hủy bỏ"
        type="confirm"
      />
      <RejectVerifyModal
        open={openRejectModal}
        onClose={(confirm, reason) => {
          if (confirm) {
            handleReject(reason || "");
          }
          setOpenRejectModal(false);
        }}
      />
    </>
  );
};

export default VerifyHistory;
