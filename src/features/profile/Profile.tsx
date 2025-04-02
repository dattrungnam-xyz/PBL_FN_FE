import React, { useState, useEffect } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  AccountCircle,
  CameraAlt,
  Security,
  LocationOn,
  Edit,
  Delete,
  Add,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Content } from "../../layouts";
import AddressDialog from "./AddressDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../../services/user.service";
import { toast } from "react-toastify";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import { ICreateUserAddress, IUserAddress } from "../../interface";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  updateUserAddress,
} from "../../services/userAddress.service";
import { getAddressTypeText } from "../../utils";
import ConfirmDeleteAddressDialog from "./dialog/ConfirmDeleteAddressDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
}

interface AddressDialogState {
  open: boolean;
  editData: IUserAddress | undefined;
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const [addressDialog, setAddressDialog] = useState<AddressDialogState>({
    open: false,
    editData: undefined,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const [errorPassword, setErrorPassword] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    password: false,
    passwordConfirm: false,
  });

  const [confirmDeleteAddressDialog, setConfirmDeleteAddressDialog] =
    useState(false);

  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const { data: userAddresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: getUserAddresses,
  });

  const [addresses, setAddresses] = useState<IUserAddress[]>([]);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      phone?: string;
      email?: string;
      avatar?: string;
    }) => updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data);
      toast.success("Cập nhật thông tin thành công");
      setFormData({
        name: data.name,
        phone: data.phone,
        email: data.email,
        avatar: data.avatar || "",
      });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
      setPasswordData({
        currentPassword: "",
        password: "",
        passwordConfirm: "",
      });
      setErrorPassword({
        currentPassword: "",
        password: "",
        passwordConfirm: "",
      });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu");
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Thêm địa chỉ thành công");
      handleCloseAddressDialog();
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi thêm địa chỉ");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: updateUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Cập nhật địa chỉ thành công");
      handleCloseAddressDialog();
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật địa chỉ");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Xóa địa chỉ thành công");
      setDeleteAddressId(null);
      setConfirmDeleteAddressDialog(false);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa địa chỉ");
      setDeleteAddressId(null);
      setConfirmDeleteAddressDialog(false);
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar || "",
      });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  useEffect(() => {
    if (userAddresses) {
      setAddresses(userAddresses);
    }
  }, [userAddresses]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        setFormData((prev) => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errorPassword[name as keyof typeof errorPassword]) {
      setErrorPassword((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTogglePasswordVisibility = (
    field: keyof typeof showPasswords,
  ) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateProfile = () => {
    let isValid = true;
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Vui lòng nhập họ và tên" }));
      isValid = false;
    }
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Vui lòng nhập email" }));
      isValid = false;
    }
    return isValid;
  };
  const handleProfileSubmit = () => {
    setErrors({ name: "", email: "" });

    if (!validateProfile()) return;

    const changedFields: Record<string, string> = {};

    if (user) {
      if (formData.name !== user.name) changedFields.name = formData.name;
      if (formData.phone !== user.phone) changedFields.phone = formData.phone;
      if (formData.email !== user.email) changedFields.email = formData.email;
      if (formData.avatar !== user.avatar)
        changedFields.avatar = formData.avatar;
    }

    if (Object.keys(changedFields).length > 0) {
      updateProfileMutation.mutate(changedFields);
    } else {
      toast.info("Không có thay đổi nào để cập nhật");
    }
  };
  const handleValidateUpdatePassword = () => {
    let isValid = true;
    if (!passwordData.currentPassword.trim()) {
      setErrorPassword((prev) => ({
        ...prev,
        currentPassword: "Vui lòng nhập mật khẩu hiện tại",
      }));
      isValid = false;
    }
    if (!passwordData.password.trim()) {
      setErrorPassword((prev) => ({
        ...prev,
        password: "Vui lòng nhập mật khẩu mới",
      }));
      isValid = false;
    }
    if (!passwordData.passwordConfirm.trim()) {
      setErrorPassword((prev) => ({
        ...prev,
        passwordConfirm: "Vui lòng nhập mật khẩu xác nhận",
      }));
      isValid = false;
    }
    if (passwordData.password !== passwordData.passwordConfirm) {
      setErrorPassword((prev) => ({
        ...prev,
        passwordConfirm: "Mật khẩu không khớp",
      }));
      isValid = false;
    }
    return isValid;
  };

  const handlePasswordSubmit = () => {
    if (!handleValidateUpdatePassword()) return;

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      password: passwordData.password,
      passwordConfirm: passwordData.passwordConfirm,
    });
  };

  const handleOpenAddressDialog = (editData?: IUserAddress) => {
    setAddressDialog({ open: true, editData });
  };

  const handleCloseAddressDialog = () => {
    setAddressDialog({ open: false, editData: undefined });
  };

  const handleAddressSubmit = (data: ICreateUserAddress | IUserAddress) => {
    if ("id" in data) {
      updateAddressMutation.mutate(data);
    } else {
      createAddressMutation.mutate(data);
    }
  };

  const handleDeleteAddressSubmit = () => {
    if (deleteAddressId) {
      deleteAddressMutation.mutate(deleteAddressId);
    }
  };

  return (
    <>
      {isLoading && <CustomBackdrop />}
      {isLoadingAddresses && <CustomBackdrop />}
      <Content>
        <Box sx={{ width: "100%", p: 2 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
            Hồ sơ của tôi
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 0.5 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
            >
              <Tab
                icon={<AccountCircle />}
                label="Thông tin cá nhân"
                iconPosition="start"
              />
              <Tab icon={<Security />} label="Bảo mật" iconPosition="start" />
              <Tab icon={<LocationOn />} label="Địa chỉ" iconPosition="start" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Paper sx={{ p: 1 }}>
              <Stack spacing={1} alignItems="center" maxWidth={500} mx="auto">
                <Box position="relative">
                  <Avatar
                    src={avatar || "/path/to/default-avatar.jpg"}
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    component="label"
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <CameraAlt sx={{ color: "white", fontSize: "1.2rem" }} />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  size="small"
                  label="Họ và tên"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={handleProfileSubmit}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending
                    ? "Đang cập nhật..."
                    : "Lưu thay đổi"}
                </Button>
              </Stack>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Paper sx={{ p: 1 }}>
              <Stack spacing={1} maxWidth={500} mx="auto">
                <Typography variant="h6" sx={{ mb: 0 }}>
                  Đổi mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Mật khẩu hiện tại"
                  type={showPasswords.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  error={!!errorPassword.currentPassword}
                  helperText={errorPassword.currentPassword}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleTogglePasswordVisibility("currentPassword")
                            }
                            edge="end"
                          >
                            {showPasswords.currentPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Mật khẩu mới"
                  type={showPasswords.password ? "text" : "password"}
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  error={!!errorPassword.password}
                  helperText={errorPassword.password}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleTogglePasswordVisibility("password")
                            }
                            edge="end"
                          >
                            {showPasswords.password ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Xác nhận mật khẩu mới"
                  type={showPasswords.passwordConfirm ? "text" : "password"}
                  name="passwordConfirm"
                  value={passwordData.passwordConfirm}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  error={!!errorPassword.passwordConfirm}
                  helperText={errorPassword.passwordConfirm}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleTogglePasswordVisibility("passwordConfirm")
                            }
                            edge="end"
                          >
                            {showPasswords.passwordConfirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={handlePasswordSubmit}
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending
                    ? "Đang cập nhật..."
                    : "Cập nhật mật khẩu"}
                </Button>
              </Stack>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => handleOpenAddressDialog()}
                >
                  Thêm địa chỉ mới
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                {addresses.map((address) => (
                  <Box
                    key={address.id}
                    sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 4px)" } }}
                  >
                    <Card>
                      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                        <Stack spacing={0.5}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              {getAddressTypeText(address.type)}
                            </Typography>
                            <Box>
                              <Tooltip title="Sửa">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleOpenAddressDialog(address)
                                  }
                                >
                                  <Edit sx={{ fontSize: "1.2rem" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setDeleteAddressId(address.id);
                                    setConfirmDeleteAddressDialog(true);
                                  }}
                                >
                                  <Delete sx={{ fontSize: "1.2rem" }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 0.5 }} />
                          <Typography variant="body2">
                            {address.name}
                          </Typography>
                          <Typography variant="body2">
                            {address.phone}
                          </Typography>
                          <Typography variant="body2">
                            {address.textAddress}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
                {userAddresses?.length === 0 && (
                  <Typography variant="body2" textAlign="center">
                    Bạn chưa có địa chỉ nào
                  </Typography>
                )}
              </Box>
            </Stack>

            <AddressDialog
              open={addressDialog.open}
              onClose={handleCloseAddressDialog}
              onSubmit={handleAddressSubmit}
              editData={addressDialog.editData}
            />
          </TabPanel>
        </Box>
      </Content>
      <ConfirmDeleteAddressDialog
        open={confirmDeleteAddressDialog}
        onClose={(confirm) => (confirm ? handleDeleteAddressSubmit() : null)}
        keepMounted={false}
      />
    </>
  );
};

export default Profile;
