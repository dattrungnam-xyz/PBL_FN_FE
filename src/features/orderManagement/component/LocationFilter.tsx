import { IProvince, IDistrict, IWard } from "../../../interface";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface FilterState {
  province: string;
  district: string;
  ward: string;
}

interface LocationFilterProps {
  filters: FilterState;
  onFilterChange: (field: keyof FilterState, value: string) => void;
  provinces: IProvince[];
  districts: IDistrict[];
  wards: IWard[];
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  filters,
  onFilterChange,
  provinces,
  districts,
  wards,
}) => {
  return (
    <>
      <FormControl sx={{ width: 200 }} size="small">
        <InputLabel>Tỉnh/Thành phố</InputLabel>
        <Select
          name="province"
          value={filters.province}
          label="Tỉnh/Thành phố"
          onChange={(e) => onFilterChange("province", e.target.value)}
          MenuProps={{
            MenuListProps: {
              sx: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {provinces.map((province: IProvince) => (
            <MenuItem key={province.id} value={province.id}>
              {province.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 200 }} size="small">
        <InputLabel>Quận/Huyện</InputLabel>
        <Select
          name="district"
          value={filters.district}
          label="Quận/Huyện"
          onChange={(e) => onFilterChange("district", e.target.value)}
          disabled={!filters.province}
          MenuProps={{
            MenuListProps: {
              sx: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {districts.map((district: IDistrict) => (
            <MenuItem key={district.id} value={district.id}>
              {district.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 200 }} size="small">
        <InputLabel>Phường/Xã</InputLabel>
        <Select
          name="ward"
          value={filters.ward}
          label="Phường/Xã"
          onChange={(e) => onFilterChange("ward", e.target.value)}
          disabled={!filters.district}
          MenuProps={{
            MenuListProps: {
              sx: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {wards.map((ward: IWard) => (
            <MenuItem key={ward.id} value={ward.id}>
              {ward.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default LocationFilter;
