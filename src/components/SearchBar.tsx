import { Box, TextField, MenuItem, Button, Menu } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { Category } from "../enums";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleCategoryClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    handleCategoryClose();
  };

  const handleSearch = () => {
    navigate(`/products?category=${selectedCategory}&search=${search}`);
  };

  const categories = [
    { value: "all", label: "Tất cả danh mục" },
    { value: Category.FOOD, label: "Thực phẩm" },
    { value: Category.BEVERAGE, label: "Đồ uống" },
    { value: Category.HERB, label: "Thảo dược" },
    { value: Category.HANDICRAFTS_DECORATION, label: "Đồ thủ công" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        maxWidth: 800,
        width: "100%",
        mx: "auto",
        bgcolor: "background.paper",
        borderRadius: 2,
        p: 1,
      }}
    >
      <Box sx={{ position: "relative", flex: 1, display: "flex" }}>
        <Button
          variant="outlined"
          // onClick={handleCategoryClick}
          sx={{
            borderRadius: "8px 0 0 8px",
            borderRight: "none",
            minWidth: 150,
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
        >
          Tất cả danh mục
        </Button>
        <TextField
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm OCOP..."
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              backgroundColor: "white",
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            },
          }}
        />
        <Button
          variant="outlined"
          sx={{
            borderRadius: "0 8px 8px 0",
            borderLeft: "none",
            minWidth: 50,
            px: 2,
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
          onClick={() => handleSearch()}
        >
          <SearchIcon sx={{ color: "primary.main" }} />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCategoryClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.value}
              onClick={() => handleCategorySelect(category.value as Category)}
            >
              {category.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default SearchBar;
