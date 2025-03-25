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
} from "@mui/material";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { Category, SellingProductStatus } from "../../../enums";
import { getCategoryText, getSellingStatusText } from "../../../utils";
import ConfirmCreateProductDialog from "../dialog/ConfirmCreateProductDialog";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";

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

interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  quantity: string;
  status: SellingProductStatus;
  images: string[];
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  quantity?: string;
  status?: string;
  images?: string;
}

const categories = [
  Category.FOOD,
  Category.BEVERAGE,
  Category.HERB,
  Category.HANDICRAFTS_DECORATION,
];

const CreateProduct = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    status: SellingProductStatus.SELLING,
    images: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tên sản phẩm";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả sản phẩm";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    if (!formData.price) {
      newErrors.price = "Vui lòng nhập giá sản phẩm";
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = "Giá sản phẩm phải lớn hơn 0";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Vui lòng nhập số lượng";
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh sản phẩm";
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
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
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
    // Clear error when user makes a selection
    if (errors[name as keyof FormErrors]) {
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
          newImages.map((file) => convertToBase64(file))
        );
        
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...base64Strings],
        }));

        // Create preview URLs
        const newPreviews = newImages.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        // Clear error when images are added
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
      setOpenConfirmDialog(true);
    }
  };

  const handleCreateProduct = () => {
    setOpenConfirmDialog(false);
    console.log(formData);
    setLoading(true);
  };

  return (
    <>
      <ConfirmCreateProductDialog
        open={openConfirmDialog}
        onClose={(confirm) =>
          confirm ? handleCreateProduct() : setOpenConfirmDialog(false)
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
            Thêm sản phẩm mới
          </Typography>
        </Box>

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
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title}
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
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  bgcolor: "background.paper",
                                }}
                                onClick={() => handleRemoveImage(index)}
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
                sx={{
                  bgcolor: "success.main",
                  minWidth: 120,
                  "&:hover": {
                    bgcolor: "success.dark",
                  },
                }}
              >
                Tạo sản phẩm
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default CreateProduct;
