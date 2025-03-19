import { Box, TextField, MenuItem, Button, Menu } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const SearchBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const open = Boolean(anchorEl);

  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleCategoryClose();
  };

  const categories = [
    { value: "all", label: "Tất cả danh mục" },
    { value: "food", label: "Thực phẩm" },
    { value: "beverage", label: "Đồ uống" },
    { value: "herb", label: "Thảo dược" },
    { value: "handicraft", label: "Đồ thủ công" },
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
          onClick={handleCategoryClick}
          sx={{
            borderRadius: "8px 0 0 8px",
            borderRight: "none",
            minWidth: 150,
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
        >
          {categories.find((cat) => cat.value === selectedCategory)?.label}
        </Button>
        <TextField
          fullWidth
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
              onClick={() => handleCategorySelect(category.value)}
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
