import React, { useEffect, useState } from "react";
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
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import {
  ICreateUserAddress,
  IDistrict,
  IProvince,
  IUserAddress,
  IWard,
} from "../../interface";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../../services/location.service";

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateUserAddress | IUserAddress) => void;
  editData?: IUserAddress;
}

const AddressDialog: React.FC<AddressDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editData,
}) => {
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  const [formData, setFormData] = useState<ICreateUserAddress>({
    type: "home",
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    textAddress: "",
  });
  const [errors, setErrors] = useState<Partial<ICreateUserAddress>>({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        type: "home",
        name: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        textAddress: "",
      });
    }
  }, [editData]);

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
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [formData.province]);

  useEffect(() => {
    const fetchWards = async () => {
      if (formData.district) {
        const wards = await getWards(formData.district);
        setWards(wards);
      } else {
        setWards([]);
      }
    };
    fetchWards();
  }, [formData.district]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ICreateUserAddress]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (
    event: SelectChangeEvent<"home" | "office" | "other">,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ICreateUserAddress]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (errors[name as keyof ICreateUserAddress]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ICreateUserAddress> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    }
    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    }
    if (!formData.district) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }
    if (!formData.ward) {
      newErrors.ward = "Vui lòng chọn phường/xã";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formData.textAddress = `${formData.address}, ${
      wards.find((ward) => ward.id === formData.ward)?.name
    }, ${
      districts.find((district) => district.id === formData.district)?.name
    }, ${
      provinces.find((province) => province.id === formData.province)?.name
    }`;

    if (validateForm()) {
      if (editData) {
        onSubmit({
          ...formData,
          id: editData.id,
          isDefault: editData.isDefault,
        });
      } else {
        onSubmit(formData);
      }
      setFormData({
        type: "home",
        name: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        textAddress: "",
      });
    }
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
                value={formData.type}
                label="Loại địa chỉ"
                onChange={handleTypeChange}
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
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              name="phone"
              size="small"
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
            />

            <FormControl fullWidth size="small" error={!!errors.province}>
              <InputLabel>Tỉnh/Thành phố</InputLabel>
              <Select
                name="province"
                value={formData.province}
                label="Tỉnh/Thành phố"
                onChange={handleLocationChange}
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

            <FormControl fullWidth size="small" error={!!errors.district}>
              <InputLabel>Quận/Huyện</InputLabel>
              <Select
                name="district"
                value={formData.district}
                label="Quận/Huyện"
                onChange={handleLocationChange}
                disabled={!formData.province}
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
                onChange={handleLocationChange}
                disabled={!formData.district}
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
              {errors.ward && <FormHelperText>{errors.ward}</FormHelperText>}
            </FormControl>

            <TextField
              name="address"
              size="small"
              label="Địa chỉ"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              error={!!errors.address}
              helperText={errors.address}
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
