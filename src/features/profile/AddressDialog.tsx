import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export interface AddressData {
  type: "home" | "office" | "other";
  name: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
}

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddressData) => void;
  editData?: AddressData;
}

const AddressDialog: React.FC<AddressDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editData,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      type: formData.get("type") as AddressData["type"],
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      district: formData.get("district") as string,
      ward: formData.get("ward") as string,
      address: formData.get("address") as string,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ p: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {editData ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack sx={{ pt: 0.5 }} spacing={1}>
            <FormControl size="small" fullWidth>
              <InputLabel>Loại địa chỉ</InputLabel>
              <Select
                name="type"
                defaultValue={editData?.type || "home"}
                label="Loại địa chỉ"
              >
                <MenuItem value="home">Nhà riêng</MenuItem>
                <MenuItem value="office">Văn phòng</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="name"
              size="small"
              label="Họ và tên"
              defaultValue={editData?.name}
              fullWidth
              required
            />

            <TextField
              name="phone"
              size="small"
              label="Số điện thoại"
              defaultValue={editData?.phone}
              fullWidth
              required
            />

            <TextField
              name="city"
              size="small"
              label="Tỉnh/Thành phố"
              defaultValue={editData?.city}
              fullWidth
              required
            />

            <TextField
              name="district"
              size="small"
              label="Quận/Huyện"
              defaultValue={editData?.district}
              fullWidth
              required
            />

            <TextField
              name="ward"
              size="small"
              label="Phường/Xã"
              defaultValue={editData?.ward}
              fullWidth
              required
            />

            <TextField
              name="address"
              size="small"
              label="Địa chỉ cụ thể"
              defaultValue={editData?.address}
              fullWidth
              required
              multiline
              rows={2}
              placeholder="Số nhà, tên đường..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button size="small" onClick={onClose}>
            Hủy
          </Button>
          <Button size="small" variant="contained" type="submit">
            {editData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddressDialog;
