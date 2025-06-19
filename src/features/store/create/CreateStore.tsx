import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import {
  ICreateStoreError,
  ICreateStore,
  IProvince,
  IDistrict,
  IWard,
} from "../../../interface";
import {
  getProvinces,
  getDistricts,
  getWards,
} from "../../../services/location.service";
import { convertToBase64 } from "../../../utils/convertToBase64";
import { createStore } from "../../../services/store.service";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { authActions, AuthState } from "../../../stores/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { me } from "../../../services/auth.service";

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
  const [formData, setFormData] = useState<ICreateStore>({
    name: "",
    description: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    phone: "",
    email: "",
    avatar: "",
    banner: "",
    provinceName: "",
    districtName: "",
    wardName: "",
  });
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<ICreateStoreError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      const provinces = await getProvinces();
      setProvinces(provinces);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.province) {
        const districts = await getDistricts(formData.province);
        setDistricts(districts);
      }
    };
    fetchDistricts();
  }, [formData.province]);

  useEffect(() => {
    const fetchWards = async () => {
      if (formData.district) {
        const wards = await getWards(formData.district);
        setWards(wards);
      }
    };
    fetchWards();
  }, [formData.district]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    if (name === "province") {
      setDistricts([]);
      setFormData((prev) => ({ ...prev, district: "", ward: "" }));
      setErrors((prev) => ({ ...prev, district: "", ward: "" }));
      setWards([]);
    } else if (name === "district") {
      setWards([]);
      setFormData((prev) => ({ ...prev, ward: "" }));
      setErrors((prev) => ({ ...prev, ward: "" }));
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64String = await convertToBase64(file);

      setFormData((prev) => ({
        ...prev,
        [type]: base64String as string,
      }));

      if (type === "avatar") {
        setAvatarPreview(URL.createObjectURL(file));
      } else if (type === "banner") {
        setBannerPreview(URL.createObjectURL(file));
      }
      setErrors((prev) => ({
        ...prev,
        [type]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        formData.wardName =
          wards.find((ward) => ward.id == formData.ward)?.name || "";
        formData.districtName =
          districts.find((district) => district.id == formData.district)
            ?.name || "";
        formData.provinceName =
          provinces.find((province) => province.id == formData.province)
            ?.name || "";

        await createStore(formData);
        toast.success("Tạo cửa hàng thành công");
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        const user = await me(token!);
        dispatch(
          authActions.login({
            token: token!,
            user,
            refreshToken: refreshToken!,
          }),
        );

        navigate("/seller");
      } catch (error) {
        console.error("Error creating store:", error);
        toast.error("Tạo cửa hàng thất bại");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = () => {
    const errors: ICreateStoreError = {};
    if (!formData.name) errors.name = "Tên cửa hàng là bắt buộc";
    if (!formData.province) errors.province = "Tỉnh/Thành phố là bắt buộc";
    if (!formData.phone) errors.phone = "Số điện thoại là bắt buộc";
    if (!formData.email) errors.email = "Email là bắt buộc";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  if (user?.storeId) {
    return <Navigate to="/seller" />;
  }

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
            Tạo cửa hàng mới
          </Typography>
        </Box>

        <form noValidate onSubmit={handleSubmit}>
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
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
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
                    error={!!errors.description}
                    helperText={errors.description}
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
                    error={!!errors.address}
                    helperText={errors.address}
                    size="small"
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.province}
                    >
                      <InputLabel>Tỉnh/Thành phố</InputLabel>
                      <Select
                        name="province"
                        value={formData.province}
                        label="Tỉnh/Thành phố"
                        onChange={handleSelectChange}
                        MenuProps={{
                          MenuListProps: {
                            sx: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        {provinces.map((province) => (
                          <MenuItem key={province.id} value={province.id}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.province && (
                        <FormHelperText>{errors.province}</FormHelperText>
                      )}
                    </FormControl>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.district}
                    >
                      <InputLabel>Quận/Huyện</InputLabel>
                      <Select
                        name="district"
                        value={formData.district}
                        label="Quận/Huyện"
                        onChange={handleSelectChange}
                        MenuProps={{
                          MenuListProps: {
                            sx: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        {districts.map((district) => (
                          <MenuItem key={district.id} value={district.id}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.district && (
                        <FormHelperText>{errors.district}</FormHelperText>
                      )}
                    </FormControl>
                    <FormControl fullWidth size="small" error={!!errors.ward}>
                      <InputLabel>Phường/Xã</InputLabel>
                      <Select
                        name="ward"
                        value={formData.ward}
                        label="Phường/Xã"
                        onChange={handleSelectChange}
                        MenuProps={{
                          MenuListProps: {
                            sx: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        {wards.map((ward) => (
                          <MenuItem key={ward.id} value={ward.id}>
                            {ward.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.ward && (
                        <FormHelperText>{errors.ward}</FormHelperText>
                      )}
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
                      error={!!errors.phone}
                      helperText={errors.phone}
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
                      error={!!errors.email}
                      helperText={errors.email}
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
    </>
  );
};

export default CreateStore;
