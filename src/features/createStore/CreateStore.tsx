import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  SelectChangeEvent,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
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

const CreateStore = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    phone: "",
    email: "",
    avatar: null as File | null,
    banner: null as File | null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }));

      if (type === "avatar") {
        setAvatarPreview(URL.createObjectURL(file));
      } else if (type === "banner") {
        setBannerPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{ color: "text.primary" }}
        >
          Tạo cửa hàng mới
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Store Media */}
          <Card>
            <CardHeader
              title="Hình ảnh cửa hàng"
              slotProps={{
                titleTypographyProps: { variant: "h6" },
              }}
            />
            <Divider />
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                {/* Avatar Section */}
                <Box sx={{ width: { xs: "100%", sm: "300px" } }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Avatar cửa hàng
                  </Typography>
                  <Stack spacing={1} alignItems="center">
                    <Avatar
                      src={avatarPreview}
                      sx={{
                        width: 200,
                        height: 200,
                        bgcolor: "grey.100",
                        border: "1px dashed",
                        borderColor: "grey.300",
                      }}
                    >
                      {!avatarPreview && (
                        <AddPhotoAlternateIcon
                          sx={{ fontSize: 60, color: "grey.400" }}
                        />
                      )}
                    </Avatar>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{
                        color: "success.main",
                        borderColor: "success.main",
                        "&:hover": {
                          borderColor: "success.dark",
                        },
                      }}
                    >
                      {formData.avatar ? "Thay đổi avatar" : "Tải lên avatar"}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "avatar")}
                      />
                    </Button>
                  </Stack>
                </Box>

                {/* Banner Section */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Banner cửa hàng
                  </Typography>
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed",
                        borderColor: "grey.300",
                        overflow: "hidden",
                      }}
                    >
                      {bannerPreview ? (
                        <Box
                          component="img"
                          src={bannerPreview}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Stack alignItems="center" spacing={1}>
                          <AddPhotoAlternateIcon
                            sx={{ fontSize: 60, color: "grey.400" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Kích thước đề xuất: 1200 x 400 px
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{
                        color: "success.main",
                        borderColor: "success.main",
                        "&:hover": {
                          borderColor: "success.dark",
                        },
                      }}
                    >
                      {formData.banner ? "Thay đổi banner" : "Tải lên banner"}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "banner")}
                      />
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

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
                  fullWidth
                  label="Tên cửa hàng"
                  name="storeName"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader
              title="Thông tin liên hệ"
              slotProps={{
                titleTypographyProps: { variant: "h6" },
              }}
            />
            <Divider />
            <CardContent>
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  size="small"
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tỉnh/Thành phố</InputLabel>
                    <Select
                      name="province"
                      value={formData.province}
                      label="Tỉnh/Thành phố"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="hanoi">Hà Nội</MenuItem>
                      <MenuItem value="hochiminh">TP. Hồ Chí Minh</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Quận/Huyện</InputLabel>
                    <Select
                      name="district"
                      value={formData.district}
                      label="Quận/Huyện"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="district1">Quận 1</MenuItem>
                      <MenuItem value="district2">Quận 2</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Phường/Xã</InputLabel>
                    <Select
                      name="ward"
                      value={formData.ward}
                      label="Phường/Xã"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="ward1">Phường 1</MenuItem>
                      <MenuItem value="ward2">Phường 2</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                  />
                </Stack>
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
              Tạo cửa hàng
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateStore;
