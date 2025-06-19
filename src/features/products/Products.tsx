/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Typography,
  Divider,
  Stack,
  TextField,
  Pagination,
  Autocomplete,
  Chip,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { Content } from "../../layouts";
import { RootState } from "../../stores";
import { useSelector } from "react-redux";
import { IProduct, IProvince } from "../../interface";
import { getProducts } from "../../services/product.service";
import { Category, OrderStatus, VerifyOCOPStatus } from "../../enums";
import { getProvinces } from "../../services/location.service";
import {
  createSearchHistory,
  createViewHistory,
} from "../../services/searchHistory.service";
import { useSearchParams } from "react-router-dom";

const categories = [
  { value: Category.FOOD, label: "Thực phẩm" },
  { value: Category.BEVERAGE, label: "Đồ uống" },
  { value: Category.HERB, label: "Thảo dược" },
  { value: Category.HANDICRAFTS_DECORATION, label: "Đồ thủ công" },
];

const Products = () => {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [isPriceFilterEnabled, setIsPriceFilterEnabled] =
    useState<boolean>(false);
  const [selectedProvinces, setSelectedProvinces] = useState<IProvince[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;
  const [search, setSearch] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);

  const [products, setProducts] = useState<IProduct[]>([]);

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [searchParams] = useSearchParams();
  const search_param = searchParams.get("search");
  const category_param = searchParams.get("category");

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await getProvinces();
      setProvinces(response);
    };
    fetchProvinces();
  }, []);

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setMinPrice(value);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setMaxPrice(value);
  };

  const getListProducts = async ({
    search_param,
    category_param,
  }: {
    search_param?: string;
    category_param?: Category;
  }) => {
    const searchHistory = localStorage.getItem("searchHistory");
    const viewHistory = localStorage.getItem("viewHistory");
    const searchHistoryArray = JSON.parse(searchHistory || "[]") || [];
    const viewHistoryArray = JSON.parse(viewHistory || "[]") || [];
    let payload = [];
    if (search) {
      payload = [...searchHistoryArray, search];
    } else {
      payload = [...searchHistoryArray];
    }
    if (searchHistoryArray.length > 0 && user) {
      await createSearchHistory(payload);
      localStorage.setItem("searchHistory", JSON.stringify([]));
    } else {
      localStorage.setItem("searchHistory", JSON.stringify(payload));
    }
    if (viewHistoryArray.length > 0 && user) {
      await createViewHistory(viewHistoryArray);
      localStorage.setItem("viewHistory", JSON.stringify([]));
    }

    const response = await getProducts({
      categories: selectedCategories.length
        ? selectedCategories
        : (category_param && category_param !== "all" as Category)
          ? [category_param]
          : undefined,
      provinces: selectedProvinces.map((province) => province.id),
      minPrice: isPriceFilterEnabled ? minPrice : undefined,
      maxPrice: isPriceFilterEnabled ? maxPrice : undefined,
      search: search ? search : search_param ? search_param : undefined,
      userId: user?.id,
      page,
      limit: itemsPerPage,
      searchHistory: searchHistoryArray,
      viewHistory: viewHistoryArray,
    });
    setProducts(response.data);
    setTotalProducts(response.total);
  };

  useEffect(() => {
    if (search_param) {
      setSearch(search_param);
    }
    if (category_param && category_param !== "all") {
      setSelectedCategories([category_param as Category]);
    }

    getListProducts({
      search_param: search_param || undefined,
      category_param: category_param as Category | undefined,
    });
  }, [search_param, category_param]);

  // useEffect(() => {
  //   getListProducts({});
  // }, [page, search, JSON.stringify(selectedCategories)]);


  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleClickButtonSearch = async () => {
    setPage(1);
    getListProducts({});
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
              p: 1.5,
              borderRadius: 1.5,
              height: "fit-content",
              border: 1,
              borderColor: "divider",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.125rem",
                mb: 1.5,
                fontWeight: 600,
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Bộ lọc
            </Typography>

            {/* Search Text Field */}
            <Box sx={{ mb: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Box>

            {/* Category Filter */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                }}
              >
                Danh mục
              </Typography>
              <Autocomplete
                multiple
                options={categories}
                getOptionLabel={(option) => option.label}
                value={categories.filter((category) =>
                  selectedCategories.includes(category.value),
                )}
                onChange={(_event, newValue) => {
                  setSelectedCategories(
                    newValue.map((category) => category.value),
                  );
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.label}
                      {...getTagProps({ index })}
                      size="small"
                      sx={{
                        color: "primary.dark",
                        "& .MuiChip-deleteIcon": {
                          color: "primary.dark",
                          "&:hover": {
                            color: "primary.main",
                          },
                        },
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Chọn danh mục..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-inputRoot": {
                    paddingY: 0.5,
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 1.5, borderColor: "divider" }} />

            {/* Province Filter */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                }}
              >
                Tỉnh/Thành phố
              </Typography>
              <Autocomplete
                multiple
                options={provinces}
                getOptionLabel={(option) => option.name}
                value={selectedProvinces}
                onChange={(_event, newValue) => {
                  setSelectedProvinces(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      size="small"
                      sx={{
                        color: "primary.dark",
                        "& .MuiChip-deleteIcon": {
                          color: "primary.dark",
                          "&:hover": {
                            color: "primary.main",
                          },
                        },
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Chọn tỉnh/thành phố..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-inputRoot": {
                    paddingY: 0.5,
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 1.5, borderColor: "divider" }} />

            {/* Price Range */}
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 0.75 }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  Khoảng giá
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={isPriceFilterEnabled}
                      onChange={(e) =>
                        setIsPriceFilterEnabled(e.target.checked)
                      }
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Lọc theo giá
                    </Typography>
                  }
                />
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  type="number"
                  label="Từ"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  InputProps={{
                    endAdornment: <Typography variant="body2">đ</Typography>,
                  }}
                  disabled={!isPriceFilterEnabled}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Đến"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  InputProps={{
                    endAdornment: <Typography variant="body2">đ</Typography>,
                  }}
                  disabled={!isPriceFilterEnabled}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Search Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                sx={{
                  py: 0.5,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() => handleClickButtonSearch()}
              >
                Tìm kiếm
              </Button>
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
              {products?.map((product) => (
                <ProductCard
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  rating={
                    product.reviews.reduce(
                      (acc, review) => acc + review.rating,
                      0,
                    ) / (product.reviews.length || 1)
                  }
                  ocopRating={product.star}
                  location={product.seller.provinceName}
                  image={product.images[0]}
                  soldCount={
                    product?.soldCount ||
                    product?.orderDetails
                      ?.filter(
                        (orderDetail) =>
                          orderDetail.order.orderStatus !==
                            OrderStatus.CANCELLED &&
                          orderDetail.order.orderStatus !==
                            OrderStatus.REFUNDED &&
                          orderDetail.order.orderStatus !==
                            OrderStatus.REJECTED,
                      )
                      ?.reduce(
                        (acc, orderDetail) => acc + orderDetail.quantity,
                        0,
                      ) ||
                    0
                  }
                  isVerified={
                    product.verifyOcopStatus === VerifyOCOPStatus.VERIFIED
                  }
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
                count={Math.ceil(totalProducts / itemsPerPage)}
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
