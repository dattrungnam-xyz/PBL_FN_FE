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
} from "@mui/material";
import { useState, useEffect } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getProductById,
  getProductByStoreId,
} from "../../../services/product.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";
import { toast } from "react-toastify";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { convertToBase64, getCategoryText } from "../../../utils";
import { IProductTableData } from "../../../interface/product.interface";
import { SellingProductStatus, VerifyOCOPStatus } from "../../../enums";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import { createVerify } from "../../../services/verify.service";
import { ICreateVerify } from "../../../interface/verify.interface";
import ConfirmCreateVerifyDialog from "./dialog/ConfirmCreateVerifyDialog";
import Proof from "../../orders/component/Proof";

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

const VerifyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [openConfirmCreateVerifyDialog, setOpenConfirmCreateVerifyDialog] =
    useState(false);
  const [selectedProof, setSelectedProof] = useState<{
    file: string;
    index: number;
  } | null>(null);

  const { data: initialProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id || ""),
    enabled: !!id,
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
    if (
      initialProduct &&
      !selectedProducts.find((p) => p.id === initialProduct.id)
    ) {
      setSelectedProducts((prev) => [...prev, initialProduct]);
    }
  }, [initialProduct, selectedProducts]);

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

  const handleSubmit = async () => {
    if (validateForm()) {
      setOpenConfirmCreateVerifyDialog(false);
      setLoading(true);
      try {
        const payload = {
          ...formData,
          productIds: selectedProducts.map((p) => p.id),
        };
        const response = await createVerify(payload);
        navigate(`/seller/products/verify/${response.id}`);
        toast.success("Gửi yêu cầu xác thực thành công");
      } catch (error) {
        console.error("Error submitting verification:", error);
        toast.error("Có lỗi xảy ra khi gửi yêu cầu xác thực");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenProof = (file: string, index: number) => {
    setSelectedProof({ file, index });
  };

  const handleCloseProof = () => {
    setSelectedProof(null);
  };

  if (isLoadingProduct) {
    return <CustomBackdrop />;
  }

  return (
    <>
      {loading && <CustomBackdrop />}
      <Box sx={{ p: 0.5, maxWidth: 1200, margin: "0 auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 0.5,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ color: "text.primary" }}
          >
            Xác thực sản phẩm OCOP
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setOpenSearchDialog(true)}
            size="small"
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
        </Box>

        <form noValidate onSubmit={handleSubmit}>
          <Stack spacing={0.5}>
            {/* Selected Products */}
            <Card>
              <CardHeader
                title="Sản phẩm được chọn"
                slotProps={{
                  titleTypographyProps: { variant: "h6" },
                }}
              />
              <Divider />
              <CardContent sx={{ p: 1 }}>
                <Stack spacing={0.5}>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {selectedProducts.map((product) => (
                      <Paper
                        key={product.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          p: 0.5,
                          bgcolor: "success.lighter",
                          borderRadius: 1,
                          position: "relative",
                        }}
                      >
                        {product.images?.[0] && (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              overflow: "hidden",
                              cursor: "pointer",
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
                              }}
                            />
                          </Box>
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
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
                            {product.star ? (
                              <Stack
                                direction="row"
                                sx={{ alignItems: "center" }}
                                spacing={0.25}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.primary"
                                >
                                  {product.star}
                                </Typography>
                                <StarIcon
                                  fontSize="small"
                                  sx={{ color: "success.dark" }}
                                />
                              </Stack>
                            ) : null}
                          </Stack>
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
              <CardContent sx={{ p: 1 }}>
                <Stack spacing={0.5}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
                      Số sao OCOP
                    </Typography>
                    <Rating
                      value={formData.star}
                      onChange={(_event, newValue) => {
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
                      }}
                      size="large"
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
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
                      Hình ảnh minh chứng
                    </Typography>
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {certificatePreviews.map((preview, index) => (
                          <Box key={index}>
                            <Paper
                              sx={{
                                position: "relative",
                                width: 120,
                                height: 120,
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
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenProof(preview, index);
                                }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 2,
                                  right: 2,
                                  bgcolor: "background.paper",
                                }}
                                onClick={() => handleRemoveCertificate(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Paper>
                          </Box>
                        ))}
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
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
                          <Stack alignItems="center" spacing={0.5}>
                            <AddPhotoAlternateIcon
                              sx={{ fontSize: 32, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Thêm hình ảnh
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                      {errors.images && (
                        <FormHelperText error>{errors.images}</FormHelperText>
                      )}
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        size="small"
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
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/seller/products/verify")}
                sx={{
                  color: "success.main",
                  borderColor: "success.main",
                  minWidth: 100,
                  "&:hover": {
                    borderColor: "success.dark",
                    bgcolor: "success.lighter",
                  },
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  if (validateForm()) {
                    setOpenConfirmCreateVerifyDialog(true);
                  }
                }}
                variant="contained"
                size="small"
                disabled={selectedProducts.length === 0}
                sx={{
                  bgcolor: "success.main",
                  minWidth: 100,
                  "&:hover": {
                    bgcolor: "success.dark",
                  },
                }}
              >
                Gửi yêu cầu
              </Button>
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
          <Stack spacing={0.5}>
            <Typography variant="h6">Tìm kiếm sản phẩm</Typography>
            <Typography variant="body2" color="text.secondary">
              Tìm và chọn sản phẩm để xác thực OCOP
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            {/* Search and Filters */}
            <Card variant="outlined">
              <CardContent sx={{ p: 1 }}>
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
                  <Stack direction="row" spacing={0.5}>
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
                      sx={{ minWidth: 180 }}
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
                      sx={{ minWidth: 180 }}
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
                sx={{ mb: 0.5, color: "text.secondary" }}
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
                  maxHeight: 300,
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
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
                <Stack spacing={0.5}>
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
                          p: 0.5,
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
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          {product.images?.[0] && (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1,
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenProof(product.images[0], 0);
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
                            </Box>
                          )}
                          <Stack spacing={0.25}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 500 }}
                            >
                              {product.name}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
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
                                  gap: 0.25,
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
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {product.price.toLocaleString("vi-VN")}đ
                              </Typography>
                              {product.star ? (
                                <Stack
                                  direction="row"
                                  sx={{ alignItems: "center" }}
                                  spacing={0.25}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {product.star}
                                  </Typography>
                                  <StarIcon
                                    fontSize="small"
                                    sx={{ color: "success.dark" }}
                                  />
                                </Stack>
                              ) : null}
                            </Stack>
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
        <DialogActions sx={{ px: 1, py: 0.5 }}>
          <Button size="small" onClick={() => setOpenSearchDialog(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmCreateVerifyDialog
        open={openConfirmCreateVerifyDialog}
        onClose={(confirm) =>
          confirm ? handleSubmit() : setOpenConfirmCreateVerifyDialog(false)
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

export default VerifyProduct;
