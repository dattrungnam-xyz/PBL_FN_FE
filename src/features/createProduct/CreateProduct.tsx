import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
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
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

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
  status: "active" | "inactive";
  ocopStar: number;
  images: File[];
  ocopCertificate: File | null;
}

const categories = [
  "Thực phẩm",
  "Đồ uống",
  "Thủ công mỹ nghệ",
  "Dược liệu",
  "Nông sản",
  "Thủy sản",
];

const CreateProduct = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    status: "active",
    ocopStar: 0,
    images: [],
    ocopCertificate: null,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      // Create preview URLs
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        ocopCertificate: file,
      }));
      setCertificatePreview(URL.createObjectURL(file));
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

  const handleRemoveCertificate = () => {
    setFormData((prev) => ({
      ...prev,
      ocopCertificate: null,
    }));
    setCertificatePreview(null);
  };

  const handleOcopStarClick = (star: number) => {
    setFormData((prev) => ({
      ...prev,
      ocopStar: star,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <Typography variant="h4" fontWeight={600} sx={{ color: "text.primary" }}>
          Thêm sản phẩm OCOP mới
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
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
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <FormControl fullWidth required size="small">
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      label="Danh mục"
                      onChange={handleSelectChange}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth required size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      label="Trạng thái"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="active">Đang bán</MenuItem>
                      <MenuItem value="inactive">Ngừng bán</MenuItem>
                    </Select>
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
                    InputProps={{
                      endAdornment: "VND",
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
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* OCOP Information */}
          <Card>
            <CardHeader
              title="Thông tin OCOP"
              slotProps={{
                titleTypographyProps: { variant: "h6" },
              }}
            />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Đánh giá sao OCOP
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IconButton
                        key={star}
                        onClick={() => handleOcopStarClick(star)}
                        color={star <= formData.ocopStar ? "primary" : "default"}
                      >
                        {star <= formData.ocopStar ? (
                          <StarIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Giấy chứng nhận OCOP
                  </Typography>
                  <Stack spacing={1}>
                    {certificatePreview ? (
                      <Box sx={{ position: "relative", display: "inline-block" }}>
                        <Box
                          component="img"
                          src={certificatePreview}
                          sx={{
                            width: "100%",
                            maxWidth: 300,
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "background.paper",
                          }}
                          onClick={handleRemoveCertificate}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: 300,
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px dashed",
                          borderColor: "divider",
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Tải lên giấy chứng nhận OCOP
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        maxWidth: 300,
                        color: "success.main",
                        borderColor: "success.main",
                        "&:hover": {
                          borderColor: "success.dark",
                        },
                      }}
                    >
                      {formData.ocopCertificate ? "Thay đổi giấy chứng nhận" : "Tải lên giấy chứng nhận"}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleCertificateChange}
                      />
                    </Button>
                  </Stack>
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
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {imagePreviews.map((preview, index) => (
                        <Box key={index}>
                          <Paper
                            sx={{
                              position: "relative",
                              width: 150,
                              height: 150,
                              overflow: "hidden",
                              border: "1px solid",
                              borderColor: "divider",
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
                          borderColor: "divider",
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Thêm hình ảnh
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        color: "success.main",
                        borderColor: "success.main",
                        "&:hover": {
                          borderColor: "success.dark",
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

          {/* Action Buttons */}
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
  );
};

export default CreateProduct;
