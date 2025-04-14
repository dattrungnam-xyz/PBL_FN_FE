import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useEffect, useState } from "react";
import format from "date-fns/format";
import LocationFilter from "../orderManagement/component/LocationFilter";
import { getDistricts, getWards } from "../../services/location.service";
import { getProvinces } from "../../services/location.service";
import { IDistrict, IProvince, IStore, IWard } from "../../interface";
import { getStores } from "../../services/store.service";
import AdminStoreModal from "./AdminStoreModal";
import { useNavigate } from "react-router-dom";

interface FilterState {
  province: string;
  district: string;
  ward: string;
  search: string;
}

const AdminStore = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    province: "all",
    district: "all",
    ward: "all",
    search: "",
  });
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [stores, setStores] = useState<IStore[]>([]);
  const navigate = useNavigate();
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewStore = (store: IStore) => {
    setSelectedStore(store);
  };

  const handleCloseModal = () => {
    setSelectedStore(null);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const provinces = await getProvinces();
      setProvinces(provinces);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (filters.province && filters.province !== "all") {
        const districts = await getDistricts(filters.province);
        setDistricts(districts);
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [filters.province]);

  useEffect(() => {
    const fetchWards = async () => {
      if (filters.district && filters.district !== "all") {
        const wards = await getWards(filters.district);
        setWards(wards);
      } else {
        setWards([]);
      }
    };
    fetchWards();
  }, [filters.district]);

  useEffect(() => {
    const fetchStores = async () => {
      const stores = await getStores({
        page: page + 1,
        limit: rowsPerPage,
        search: filters.search,
        province: filters.province === "all" ? "" : filters.province,
        district: filters.district === "all" ? "" : filters.district,
        ward: filters.ward === "all" ? "" : filters.ward,
      });
      setStores(stores.data);
      setTotal(stores.total);
    };
    fetchStores();
  }, [filters, page, rowsPerPage]);

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h5" color="text.primary" fontWeight={600}>
          Danh sách cửa hàng
        </Typography>
      </Stack>

      <Card>
        <Stack spacing={1} sx={{ p: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Tìm kiếm cửa hàng..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ fontSize: 20, color: "text.disabled" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: 280 }}
            />

            <LocationFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              provinces={provinces}
              districts={districts}
              wards={wards}
            />
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    STT
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    Cửa hàng
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    Chủ sở hữu
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    Số điện thoại
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    Địa chỉ
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    Sản phẩm
                  </TableCell>

                  <TableCell
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    Ngày tạo
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store, index) => (
                  <TableRow key={store.id} hover>
                    <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        py: 0.25,
                      }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Avatar
                          src={store?.avatar}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                          }}
                        />
                        <Typography variant="inherit">{store.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        py: 0.25,
                      }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Avatar
                          src={store?.user?.avatar}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                          }}
                        />
                        <Typography variant="inherit">
                          {store.user.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                      {store.phone}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                      {store.address}, {store.wardName}, {store.districtName},{" "}
                      {store.provinceName}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                      {store.products.length}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                      {format(new Date(store.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.25 }}>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            color="primary"
                            sx={{
                              "&:hover": {
                                bgcolor: "primary.lighter",
                              },
                            }}
                            onClick={() => handleViewStore(store)}
                          >
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xem danh sách sản phẩm">
                          <IconButton
                            size="small"
                            color="primary"
                            sx={{
                              "&:hover": {
                                bgcolor: "primary.lighter",
                              },
                            }}
                            onClick={() =>
                              navigate(`/admin/products?storeId=${store.id}`)
                            }
                          >
                            <InventoryIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Hiển thị:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trên ${count}`
            }
            sx={{
              ".MuiTablePagination-select": {
                fontSize: "0.75rem",
              },
              ".MuiTablePagination-displayedRows": {
                fontSize: "0.75rem",
              },
              ".MuiTablePagination-selectLabel": {
                fontSize: "0.75rem",
              },
            }}
          />
        </Stack>
      </Card>

      {/* Store Detail Modal */}
      {selectedStore && (
        <AdminStoreModal
          open={Boolean(selectedStore)}
          onClose={handleCloseModal}
          storeId={selectedStore.id}
        />
      )}
    </Box>
  );
};

export default AdminStore;
