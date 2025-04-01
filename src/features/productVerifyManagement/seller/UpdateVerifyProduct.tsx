import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  IconButton,
  Paper,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductByStoreId } from "../../../services/product.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Navigate } from "react-router-dom";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { convertToBase64, getCategoryText } from "../../../utils";
import { IProductTableData } from "../../../interface/product.interface";
import { SellingProductStatus, VerifyOCOPStatus } from "../../../enums";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  getVerifyById,
  updateVerify,
  deleteVerify,
} from "../../../services/verify.service";
import { ICreateVerify, IVerifyResponse } from "../../../interface";
import ConfirmUpdateVerifyDialog from "./dialog/ConfirmUpdateVerifyDialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDeleteVerifyDialog from "./dialog/ConfirmDeleteVerifyDialog";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface FormErrors {
  star?: string;
  productName?: string;
  manufacturer?: string;
  verifyDate?: string;
  images?: string;
}

const UpdateVerifyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  const [selectedProducts, setSelectedProducts] = useState<IProductTableData[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerifyStatus, setSelectedVerifyStatus] =
    useState<VerifyOCOPStatus>(VerifyOCOPStatus.ALL);
  const [selectedProductStatus, setSelectedProductStatus] =
    useState<SellingProductStatus>(SellingProductStatus.ALL);
  const [formData, setFormData] = useState<ICreateVerify>({
    star: 0,
    productName: "",
    manufacturer: "",
    verifyDate: "",
    images: [],
    productIds: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [certificatePreviews, setCertificatePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [openConfirmUpdateDialog, setOpenConfirmUpdateDialog] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const { data: verifyData, isLoading: isLoadingVerify } =
    useQuery<IVerifyResponse>({
      queryKey: ["verify", id],
      queryFn: () => getVerifyById(id || ""),
      enabled: !!id,
    });

  const updateVerifyMutation = useMutation({
    mutationFn: (data: ICreateVerify) => updateVerify(id || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verify", id] });
      toast.success("Cập nhật yêu cầu xác thực thành công");
      navigate(`/seller/products/verify/${id}`);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật yêu cầu xác thực");
    },
  });

  const deleteVerifyMutation = useMutation({
    mutationFn: () => deleteVerify(id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verify", id] });
      toast.success("Xóa yêu cầu xác thực thành công");
      navigate("/seller/products/verify");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa yêu cầu xác thực");
    },
  });

  const { data: searchResults } = useQuery({
    queryKey: [
      "searchProducts",
      searchTerm,
      selectedVerifyStatus,
      selectedProductStatus,
    ],
    queryFn: () =>
      getProductByStoreId(user?.storeId, {
        search: searchTerm,
        page: 1,
        limit: 200,
        verifyStatus:
          selectedVerifyStatus !== VerifyOCOPStatus.ALL
            ? selectedVerifyStatus
            : undefined,
        status:
          selectedProductStatus !== SellingProductStatus.ALL
            ? selectedProductStatus
            : undefined,
      }),
  });

  useEffect(() => {
    if (verifyData) {
      const formattedDate = verifyData.verifyDate
        ? new Date(verifyData.verifyDate).toISOString().split("T")[0]
        : "";

      setFormData({
        star: verifyData.star,
        productName: verifyData.productName || "",
        manufacturer: verifyData.manufacturer,
        verifyDate: formattedDate,
        images: verifyData.images,
        productIds: verifyData.products.map((p) => p.id),
      });
      setCertificatePreviews(verifyData.images);

      if (verifyData.products) {
        setSelectedProducts(verifyData.products);
      }
    }
  }, [verifyData]);

  if (!user || !user.storeId) {
    toast.error("Bạn chưa tạo cửa hàng");
    return <Navigate to="/seller/create" />;
  }

  if (isLoadingVerify) {
    return <CustomBackdrop />;
  }

  if (!verifyData) {
    toast.error("Không tìm thấy thông tin xác thực");
    return <Navigate to="/seller/products/verify" />;
  }

  const handleSubmit = async () => {
    console.log(formData);
    if (validateForm()) {
      setLoading(true);
      try {
        const payload = {
          ...formData,
          productIds: selectedProducts.map((p) => p.id),
        };
        await updateVerifyMutation.mutateAsync(payload);
      } finally {
        setOpenConfirmUpdateDialog(false);
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteVerifyMutation.mutateAsync();
    } finally {
      setOpenConfirmDeleteDialog(false);
      setLoading(false);
    }
  };

  const getStatusColor = (status: VerifyOCOPStatus) => {
    switch (status) {
      case VerifyOCOPStatus.VERIFIED:
        return "success";
      case VerifyOCOPStatus.REJECTED:
        return "error";
      case VerifyOCOPStatus.PENDING:
        return "warning";
      case VerifyOCOPStatus.NOT_SUBMITTED:
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status: VerifyOCOPStatus) => {
    switch (status) {
      case VerifyOCOPStatus.VERIFIED:
        return "Đã xác thực";
      case VerifyOCOPStatus.REJECTED:
        return "Từ chối";
      case VerifyOCOPStatus.PENDING:
        return "Chờ xác thực";
      case VerifyOCOPStatus.NOT_SUBMITTED:
        return "Chưa xác thực";
      default:
        return status;
    }
  };

  const isEditable = verifyData.status === VerifyOCOPStatus.PENDING;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.star === 0) {
      newErrors.star = "Vui lòng chọn số sao OCOP";
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "Vui lòng nhập tên sản phẩm";
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = "Vui lòng nhập đơn vị";
    }

    if (!formData.verifyDate) {
      newErrors.verifyDate = "Vui lòng chọn ngày cấp";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh minh chứng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCertificateChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files) {
      try {
        const newImages = Array.from(files);
        const base64Strings = await Promise.all(
          newImages.map((file) => convertToBase64(file)),
        );

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...base64Strings] as string[],
        }));

        const newPreviews = newImages.map((file) => URL.createObjectURL(file));
        setCertificatePreviews((prev) => [...prev, ...newPreviews]);

        if (errors.images) {
          setErrors((prev) => ({
            ...prev,
            images: undefined,
          }));
        }
      } catch (error) {
        console.error("Error converting images to base64:", error);
        setErrors((prev) => ({
          ...prev,
          images: "Có lỗi xảy ra khi tải lên hình ảnh",
        }));
      }
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setCertificatePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      return newPreviews;
    });
  };

  const handleAddProduct = (product: IProductTableData) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <>
      {loading && <CustomBackdrop />}
      <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{ color: "text.primary" }}
            >
              Cập nhật xác thực OCOP
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={getStatusText(verifyData.status)}
                color={getStatusColor(verifyData.status)}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Tạo lúc:{" "}
                {format(new Date(verifyData.createdAt), "dd/MM/yyyy HH:mm")}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1}>
            {isEditable && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setOpenSearchDialog(true)}
                  sx={{
                    color: "success.main",
                    borderColor: "success.main",
                    "&:hover": {
                      borderColor: "success.dark",
                      bgcolor: "success.lighter",
                    },
                  }}
                >
                  Thêm sản phẩm
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenConfirmDeleteDialog(true)}
                  startIcon={<DeleteOutlineIcon />}
                  sx={{
                    color: "error.main",
                    borderColor: "error.main",
                    "&:hover": {
                      borderColor: "error.dark",
                      bgcolor: "error.lighter",
                    },
                  }}
                >
                  Xóa
                </Button>
              </>
            )}
          </Stack>
        </Box>

        <form noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Selected Products */}
            <Card>
              <CardHeader
                title="Sản phẩm được chọn"
                slotProps={{
                  titleTypographyProps: { variant: "h6" },
                }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedProducts.map((product) => (
                      <Paper
                        key={product.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 0.5,
                          bgcolor: "success.lighter",
                          borderRadius: 2,
                          position: "relative",
                        }}
                      >
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        )}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Stack>
                            <Typography
                              variant="body2"
                              sx={{ color: "success.dark", fontWeight: 500 }}
                            >
                              {product.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "success.dark" }}
                            >
                              {product.price.toLocaleString("vi-VN")}đ
                            </Typography>
                          </Stack>
                          {isEditable && (
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveProduct(product.id)}
                              sx={{
                                color: "success.dark",
                                "&:hover": {
                                  color: "error.main",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>

                  {selectedProducts.length === 0 && (
                    <Typography color="text.secondary" align="center">
                      Chưa có sản phẩm nào được chọn
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* OCOP Verification */}
            <Card>
              <CardHeader
                title="Thông tin xác thực OCOP"
                slotProps={{
                  titleTypographyProps: { variant: "h6" },
                }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Số sao OCOP
                    </Typography>
                    <Rating
                      value={formData.star}
                      onChange={(_event, newValue) => {
                        if (isEditable) {
                          setFormData((prev) => ({
                            ...prev,
                            star: newValue || 0,
                          }));
                          if (errors.star) {
                            setErrors((prev) => ({
                              ...prev,
                              star: undefined,
                            }));
                          }
                        }
                      }}
                      size="large"
                      readOnly={!isEditable}
                    />
                    {errors.star && (
                      <FormHelperText error>{errors.star}</FormHelperText>
                    )}
                  </Box>

                  <TextField
                    required
                    fullWidth
                    label="Tên sản phẩm"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.productName}
                    helperText={errors.productName}
                    disabled={!isEditable}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Đơn vị"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.manufacturer}
                    helperText={errors.manufacturer}
                    disabled={!isEditable}
                  />

                  <TextField
                    required
                    fullWidth
                    type="date"
                    label="Ngày cấp"
                    name="verifyDate"
                    value={formData.verifyDate}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.verifyDate}
                    helperText={errors.verifyDate}
                    disabled={!isEditable}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Hình ảnh minh chứng
                    </Typography>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {certificatePreviews.map((preview, index) => (
                          <Box key={index}>
                            <Paper
                              sx={{
                                position: "relative",
                                width: 150,
                                height: 150,
                                overflow: "hidden",
                                border: "1px solid",
                                borderColor: errors.images
                                  ? "error.main"
                                  : "divider",
                                borderRadius: 1,
                              }}
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              {isEditable && (
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "background.paper",
                                  }}
                                  onClick={() => handleRemoveCertificate(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Paper>
                          </Box>
                        ))}
                        {isEditable && (
                          <Box
                            sx={{
                              width: 150,
                              height: 150,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px dashed",
                              borderColor: errors.images
                                ? "error.main"
                                : "divider",
                              borderRadius: 1,
                              bgcolor: "grey.50",
                            }}
                          >
                            <Stack alignItems="center" spacing={1}>
                              <AddPhotoAlternateIcon
                                sx={{ fontSize: 40, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Thêm hình ảnh
                              </Typography>
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                      {errors.images && (
                        <FormHelperText error>{errors.images}</FormHelperText>
                      )}
                      {isEditable && (
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            color: "success.main",
                            borderColor: errors.images
                              ? "error.main"
                              : "success.main",
                            "&:hover": {
                              borderColor: errors.images
                                ? "error.dark"
                                : "success.dark",
                            },
                          }}
                        >
                          Tải lên hình ảnh minh chứng
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleCertificateChange}
                          />
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/seller/products/verify")}
                sx={{
                  color: "success.main",
                  borderColor: "success.main",
                  minWidth: 120,
                  "&:hover": {
                    borderColor: "success.dark",
                    bgcolor: "success.lighter",
                  },
                }}
              >
                Hủy
              </Button>
              {isEditable && (
                <Button
                  onClick={() => setOpenConfirmUpdateDialog(true)}
                  variant="contained"
                  size="large"
                  disabled={selectedProducts.length === 0}
                  sx={{
                    bgcolor: "success.main",
                    minWidth: 120,
                    "&:hover": {
                      bgcolor: "success.dark",
                    },
                  }}
                >
                  Cập nhật
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Box>

      {/* Search Dialog */}
      <Dialog
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Stack spacing={1}>
            <Typography variant="h6">Tìm kiếm sản phẩm</Typography>
            <Typography variant="body2" color="text.secondary">
              Tìm và chọn sản phẩm để xác thực OCOP
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {/* Search and Filters */}
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên sản phẩm hoặc mã sản phẩm"
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
                  <Stack direction="row" spacing={1}>
                    <TextField
                      select
                      size="small"
                      label="Trạng thái xác thực"
                      value={selectedVerifyStatus}
                      onChange={(e) =>
                        setSelectedVerifyStatus(
                          e.target.value as VerifyOCOPStatus,
                        )
                      }
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value={VerifyOCOPStatus.ALL}>Tất cả</MenuItem>
                      <MenuItem value={VerifyOCOPStatus.PENDING}>
                        Chờ xác thực
                      </MenuItem>
                      <MenuItem value={VerifyOCOPStatus.VERIFIED}>
                        Đã xác thực
                      </MenuItem>
                      <MenuItem value={VerifyOCOPStatus.REJECTED}>
                        Từ chối
                      </MenuItem>
                      <MenuItem value={VerifyOCOPStatus.NOT_SUBMITTED}>
                        Chưa xác thực
                      </MenuItem>
                    </TextField>
                    <TextField
                      select
                      size="small"
                      label="Trạng thái sản phẩm"
                      value={selectedProductStatus}
                      onChange={(e) =>
                        setSelectedProductStatus(
                          e.target.value as SellingProductStatus,
                        )
                      }
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value={SellingProductStatus.ALL}>
                        Tất cả
                      </MenuItem>
                      <MenuItem value={SellingProductStatus.SELLING}>
                        Đang bán
                      </MenuItem>
                      <MenuItem value={SellingProductStatus.STOPPED}>
                        Ngừng bán
                      </MenuItem>
                    </TextField>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Results */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Kết quả tìm kiếm (
                {searchResults?.data?.filter((product) =>
                  selectedProducts.every(
                    (slProduct) => slProduct.id !== product.id,
                  ),
                )?.length || 0}
                )
              </Typography>
              <Box
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#555",
                    },
                  },
                }}
              >
                <Stack spacing={1}>
                  {searchResults?.data
                    ?.filter((product) =>
                      selectedProducts.every(
                        (slProduct) => slProduct.id !== product.id,
                      ),
                    )
                    .map((product: IProductTableData) => (
                      <Paper
                        key={product.id}
                        sx={{
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            borderColor: "success.main",
                            bgcolor: "success.lighter",
                          },
                        }}
                        onClick={() => handleAddProduct(product)}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          {product.images?.[0] && (
                            <Paper
                              sx={{
                                width: 80,
                                height: 80,
                                overflow: "hidden",
                                borderRadius: 1,
                              }}
                            >
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </Paper>
                          )}
                          <Stack spacing={0.5}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 500 }}
                            >
                              {product.name}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {getCategoryText(product.category)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                •
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    product.verifyOcopStatus ===
                                    VerifyOCOPStatus.VERIFIED
                                      ? "success.main"
                                      : product.verifyOcopStatus ===
                                          VerifyOCOPStatus.REJECTED
                                        ? "error.main"
                                        : product.verifyOcopStatus ===
                                            VerifyOCOPStatus.NOT_SUBMITTED
                                          ? "warning.main"
                                          : product.verifyOcopStatus ===
                                              VerifyOCOPStatus.PENDING
                                            ? "default.main"
                                            : "default.main",
                                  fontWeight: 500,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                {product.verifyOcopStatus ===
                                VerifyOCOPStatus.VERIFIED ? (
                                  <>
                                    <CheckCircleIcon fontSize="small" />
                                    Đã xác thực
                                  </>
                                ) : null}
                                {product.verifyOcopStatus ===
                                VerifyOCOPStatus.NOT_SUBMITTED ? (
                                  <>
                                    <PendingIcon fontSize="small" />
                                    Chưa xác thực
                                  </>
                                ) : null}
                                {product.verifyOcopStatus ===
                                VerifyOCOPStatus.PENDING ? (
                                  <>
                                    <PendingIcon fontSize="small" />
                                    Chờ xác thực
                                  </>
                                ) : null}
                                {product.verifyOcopStatus ===
                                VerifyOCOPStatus.REJECTED ? (
                                  <>
                                    <CancelIcon fontSize="small" />
                                    Từ chối
                                  </>
                                ) : null}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {product.price.toLocaleString("vi-VN")}đ
                            </Typography>
                          </Stack>
                        </Stack>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          sx={{
                            color: "success.main",
                            borderColor: "success.main",
                            "&:hover": {
                              borderColor: "success.dark",
                              bgcolor: "success.lighter",
                            },
                          }}
                        >
                          Thêm
                        </Button>
                      </Paper>
                    ))}
                </Stack>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSearchDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <ConfirmUpdateVerifyDialog
        open={openConfirmUpdateDialog}
        onClose={(confirm) =>
          confirm ? handleSubmit() : setOpenConfirmUpdateDialog(false)
        }
        keepMounted={false}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteVerifyDialog
        open={openConfirmDeleteDialog}
        onClose={(confirm) =>
          confirm ? handleDelete() : setOpenConfirmDeleteDialog(false)
        }
        keepMounted={false}
      />
    </>
  );
};

export default UpdateVerifyProduct;
