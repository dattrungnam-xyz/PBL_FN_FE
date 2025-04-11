import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  Paper,
  Link,
  Alert,
  Rating,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { Category, SellingProductStatus } from "../../../enums";
import {
  convertToBase64,
  getCategoryText,
  getSellingStatusText,
} from "../../../utils";
import ConfirmUpdateProductDialog from "../dialog/ConfirmUpdateProductDialog";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../../services/product.service";
import { ICreateProduct, ICreateProductError } from "../../../interface";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";
import { toast } from "react-toastify";
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

const categories = [
  Category.FOOD,
  Category.BEVERAGE,
  Category.HERB,
  Category.HANDICRAFTS_DECORATION,
];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ICreateProduct>({
    name: "",
    description: "",
    category: Category.FOOD,
    price: 0,
    quantity: 0,
    star: 0,
    status: SellingProductStatus.SELLING,
    images: [],
  });

  const [initialData, setInitialData] = useState<ICreateProduct | null>(null);
  const [errors, setErrors] = useState<ICreateProductError>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isOcopVerified, setIsOcopVerified] = useState(false);
  const [selectedProof, setSelectedProof] = useState<{
    file: string;
    index: number;
  } | null>(null);

  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        return;
      }
      setLoading(true);

      try {
        const data = await getProductById(id);
        if (data.seller.id != user?.storeId) {
          toast.error("Bạn không có quyền cập nhật sản phẩm này");
          navigate("/products");
        }
        setFormData({
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price.toString(),
          quantity: data.quantity.toString(),
          status: data.status,
          images: data.images || [],
          star: data.star || 0,
        });

        setInitialData({
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price.toString(),
          quantity: data.quantity.toString(),
          status: data.status,
          images: data.images || [],
          star: data.star || 0,
        });

        setImagePreviews(data.images || []);
        setIsOcopVerified(data.isOcopVerified);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Sản phẩm không tồn tại");
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user?.storeId]);

  useEffect(() => {
    if (initialData) {
      const hasFormChanges =
        JSON.stringify(formData) !== JSON.stringify(initialData);
      setHasChanges(hasFormChanges);
    }
  }, [formData, initialData]);

  const validateForm = (): boolean => {
    const newErrors: ICreateProductError = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên sản phẩm";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả sản phẩm";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    if (!formData.price) {
      newErrors.price = "Vui lòng nhập giá sản phẩm";
    } else if (formData.price <= 0) {
      newErrors.price = "Giá sản phẩm phải lớn hơn 0";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Vui lòng nhập số lượng";
    } else if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh sản phẩm";
    }

    if (!formData.star) {
      newErrors.star = "Vui lòng nhập điểm sản phẩm";
    } else if (formData.star < 0 || formData.star > 5) {
      newErrors.star = "Điểm sản phẩm phải nằm trong khoảng từ 0 đến 5";
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
    if (errors[name as keyof ICreateProductError]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ICreateProductError]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImagePreviews((prev) => [...prev, ...newPreviews]);

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

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      return newPreviews;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (hasChanges) {
        setOpenConfirmDialog(true);
      }
    }
  };

  const handleUpdateProduct = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);
    try {
      await updateProduct(id!, formData);
      toast.success("Cập nhật sản phẩm thành công");
      navigate(`/seller/product/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProof = (file: string, index: number) => {
    setSelectedProof({ file, index });
  };

  const handleCloseProof = () => {
    setSelectedProof(null);
  };

  return (
    <>
      <ConfirmUpdateProductDialog
        open={openConfirmDialog}
        onClose={(confirm) =>
          confirm ? handleUpdateProduct() : setOpenConfirmDialog(false)
        }
        keepMounted={false}
      />
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
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ color: "text.primary" }}
          >
            Cập nhật sản phẩm
          </Typography>
        </Box>

        {!isOcopVerified && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Sản phẩm này chưa được xác thực OCOP.{" "}
            <Link href="/verify-product" underline="hover">
              Nhấp vào đây để xác thực
            </Link>
          </Alert>
        )}

        <form noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Basic Information */}
            <Card>
              <CardHeader
                title="Thông tin cơ bản"
                slotProps={{
                  titleTypographyProps: { variant: "h6" },
                }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={1}>
                  <TextField
                    required
                    fullWidth
                    label="Tên sản phẩm"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Mô tả sản phẩm"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      error={!!errors.category}
                    >
                      <InputLabel>Danh mục</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        label="Danh mục"
                        onChange={handleSelectChange}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {getCategoryText(category)}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <FormHelperText>{errors.category}</FormHelperText>
                      )}
                    </FormControl>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      error={!!errors.status}
                    >
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        label="Trạng thái"
                        onChange={handleSelectChange}
                      >
                        <MenuItem value={SellingProductStatus.SELLING}>
                          {getSellingStatusText(SellingProductStatus.SELLING)}
                        </MenuItem>
                        <MenuItem value={SellingProductStatus.STOPPED}>
                          {getSellingStatusText(SellingProductStatus.STOPPED)}
                        </MenuItem>
                      </Select>
                      {errors.status && (
                        <FormHelperText>{errors.status}</FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      label="Giá"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      size="small"
                      error={!!errors.price}
                      helperText={errors.price}
                      slotProps={{
                        input: {
                          endAdornment: "VND",
                        },
                      }}
                    />
                    <TextField
                      required
                      fullWidth
                      type="number"
                      label="Số lượng"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      size="small"
                      error={!!errors.quantity}
                      helperText={errors.quantity}
                    />
                  </Stack>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color={errors.star ? "error" : "text.secondary"}
                      sx={{ mb: 0.25 }}
                    >
                      Sao OCOP*
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
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "primary.main",
                        },
                        "& .MuiRating-iconHover": {
                          color: "primary.light",
                        },
                      }}
                    />
                    {errors.star && (
                      <FormHelperText error sx={{ mt: 0.25 }}>
                        {errors.star}
                      </FormHelperText>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader
                title="Hình ảnh sản phẩm"
                slotProps={{
                  titleTypographyProps: { variant: "h6" },
                }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Hình ảnh sản phẩm
                    </Typography>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {imagePreviews.map((preview, index) => (
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
                                cursor: "pointer",
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                              onClick={() => handleOpenProof(preview, index)}
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
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  bgcolor: "background.paper",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Paper>
                          </Box>
                        ))}
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
                        Tải lên hình ảnh sản phẩm
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/products")}
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
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!hasChanges}
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
            </Stack>
          </Stack>
        </form>
      </Box>
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

export default UpdateProduct;
