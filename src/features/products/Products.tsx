import {
  Box,
  Typography,
  Slider,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Stack,
  Checkbox,
  ListItemText,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Pagination,
  Button,
  Menu,
  ListItemIcon,
} from "@mui/material";
import { useState, useMemo } from "react";
import ProductCard from "../../components/ProductCard";
import { Content } from "../../layouts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const vietnamProvinces = [
  "Hà Nội",
  "TP Hồ Chí Minh",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const categories = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "food", label: "Thực phẩm" },
  { value: "beverage", label: "Đồ uống" },
  { value: "herb", label: "Thảo dược" },
  { value: "handicraft", label: "Đồ thủ công" },
];

const sortOptions = [
  { value: "popular", label: "Phổ biến", icon: <TrendingUpIcon /> },
  { value: "bestseller", label: "Bán chạy", icon: <LocalFireDepartmentIcon /> },
  { value: "newest", label: "Hàng mới", icon: <NewReleasesIcon /> },
  { value: "price_asc", label: "Giá thấp đến cao", icon: <ArrowUpwardIcon /> },
  {
    value: "price_desc",
    label: "Giá cao đến thấp",
    icon: <ArrowDownwardIcon />,
  },
];

const Products = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalProducts] = useState(25);
  const itemsPerPage = 12;
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSort, setSelectedSort] = useState("popular");

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const filteredProvinces = useMemo(() => {
    return vietnamProvinces.filter((province) =>
      province.toLowerCase().includes(provinceSearch.toLowerCase()),
    );
  }, [provinceSearch]);

  const handleProvinceToggle = (province: string) => {
    setSelectedProvinces((prev) =>
      prev.includes(province)
        ? prev.filter((p) => p !== province)
        : [...prev, province],
    );
  };

  // Sample data - replace with actual data from API
  const sampleProducts = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Sản phẩm ${index + 1}`,
    price: 100000,
    rating: 4.5,
    location: "Hà Nội",
    image: "https://via.placeholder.com/300",
  }));

  const totalPages = Math.ceil(sampleProducts.length / itemsPerPage);
  const paginatedProducts = sampleProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    handleSortClose();
  };

  return (
    <Content>
      <Box sx={{ py: { xs: 0.5, sm: 1 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
            gap: 2,
          }}
        >
          {/* Filters Section */}
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 1,
              borderRadius: 1,
              height: "fit-content",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.125rem",
                mb: 1,
                fontWeight: 600,
              }}
            >
              Bộ lọc
            </Typography>

            {/* Category Filter */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{
                  mb: 0.5,
                  fontWeight: 600,
                }}
              >
                Danh mục
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Province Filter */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Tỉnh/Thành phố
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm tỉnh/thành phố..."
                value={provinceSearch}
                onChange={(e) => setProvinceSearch(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  "&::-webkit-scrollbar": {
                    width: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: 3,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: 3,
                  },
                }}
              >
                <List dense disablePadding>
                  {filteredProvinces.map((province) => (
                    <ListItem key={province} disablePadding>
                      <ListItemButton
                        dense
                        onClick={() => handleProvinceToggle(province)}
                      >
                        <Checkbox
                          edge="start"
                          checked={selectedProvinces.includes(province)}
                          tabIndex={-1}
                          disableRipple
                          size="small"
                        />
                        <ListItemText
                          primary={province}
                          slotProps={{
                            primary: { fontSize: "0.875rem" },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
              {selectedProvinces.length > 0 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Đã chọn {selectedProvinces.length} tỉnh/thành phố
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Price Range */}
            <Box>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Khoảng giá
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000000}
                step={100000}
                marks
                  sx={{ mt: 1 }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                <Typography variant="caption">
                  {priceRange[0].toLocaleString()}đ
                </Typography>
                <Typography variant="caption">
                  {priceRange[1].toLocaleString()}đ
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* Products Section */}
          <Box>
            {/* Section Title */}
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.25rem",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Kết quả tìm kiếm
            </Typography>

            {/* Results Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                pb: 1,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.875rem",
                }}
                color="text.secondary"
              >
                Tìm thấy{" "}
                <Typography
                  component="span"
                  fontWeight="600"
                  color="text.primary"
                >
                  {totalProducts}
                </Typography>{" "}
                sản phẩm
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSortClick}
                  startIcon={
                    sortOptions.find((option) => option.value === selectedSort)
                      ?.icon
                  }
                  sx={{
                    fontSize: "0.875rem",
                    textTransform: "none",
                  }}
                >
                  {
                    sortOptions.find((option) => option.value === selectedSort)
                      ?.label
                  }
                </Button>
                <Menu
                  anchorEl={sortAnchorEl}
                  open={Boolean(sortAnchorEl)}
                  onClose={handleSortClose}
                >
                  {sortOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      selected={selectedSort === option.value}
                    >
                      <ListItemIcon>{option.icon}</ListItemIcon>
                      <ListItemText>{option.label}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>

            {/* Products Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 1,
                mb: 1,
              }}
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  location={product.location}
                  image={product.image}
                  soldCount={100}
                />
              ))}
            </Box>

            {/* Pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 1,
                    minWidth: 32,
                    height: 32,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Content>
  );
};

export default Products;
