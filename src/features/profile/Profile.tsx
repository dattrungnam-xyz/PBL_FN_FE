import React, { useState } from "react";
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
} from "@mui/material";
import {
  AccountCircle,
  CameraAlt,
  Security,
  LocationOn,
  Edit,
  Delete,
  Add,
} from "@mui/icons-material";
import { Content } from "../../layouts";
import AddressDialog, { AddressData } from "./AddressDialog";

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
  editData: AddressData | undefined;
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [addressDialog, setAddressDialog] = useState<AddressDialogState>({
    open: false,
    editData: undefined,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddressDialog = (editData?: AddressData) => {
    setAddressDialog({ open: true, editData });
  };

  const handleCloseAddressDialog = () => {
    setAddressDialog({ open: false, editData: undefined });
  };

  const handleAddressSubmit = (data: AddressData) => {
    // Handle address submission
    console.log(data);
    handleCloseAddressDialog();
  };

  return (
    <Content>
      <Box sx={{ width: "100%", p: 2 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
          Hồ sơ của tôi
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 0.5}}>
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
                defaultValue="Nguyễn Văn A"
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="Số điện thoại"
                defaultValue="0123456789"
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="Email"
                defaultValue="example@gmail.com"
                variant="outlined"
              />
              <Button variant="contained" fullWidth size="small">
                Lưu thay đổi
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
                type="password"
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="Mật khẩu mới"
                type="password"
                variant="outlined"
              />
              <TextField
                fullWidth
                size="small"
                label="Xác nhận mật khẩu mới"
                type="password"
                variant="outlined"
              />
              <Button variant="contained" fullWidth size="small">
                Cập nhật mật khẩu
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
              {[1, 2].map((address) => (
                <Box
                  key={address}
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
                            Nhà riêng
                          </Typography>
                          <Box>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleOpenAddressDialog({
                                  type: "home",
                                  name: "Nguyễn Văn A",
                                  phone: "0123456789",
                                  address: "123 Đường ABC",
                                  ward: "Phường XYZ",
                                  district: "Quận 1",
                                  city: "TP.HCM",
                                })
                              }
                            >
                              <Edit sx={{ fontSize: "1.2rem" }} />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete sx={{ fontSize: "1.2rem" }} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 0.5 }} />
                        <Typography variant="body2">Nguyễn Văn A</Typography>
                        <Typography variant="body2">0123456789</Typography>
                        <Typography variant="body2">
                          123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              ))}
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
  );
};

export default Profile;
