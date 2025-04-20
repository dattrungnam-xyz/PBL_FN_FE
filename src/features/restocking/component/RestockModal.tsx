import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { IProduct } from "../../../interface";
import { useQueryClient } from "@tanstack/react-query";
import {
  updateProductQuantity,
  getProductByStoreId,
} from "../../../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";

interface RestockModalProps {
  open: boolean;
  onClose: () => void;
}

const RestockModal = ({ open, onClose }: RestockModalProps) => {
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", user?.storeId, searchTerm],
    queryFn: () =>
      getProductByStoreId(user?.storeId || "", {
        search: searchTerm,
        limit: 1000,
      }),
    enabled: !!user?.storeId,
  });

  const handleSubmit = async () => {
    if (quantity <= 0 || !selectedProduct) return;

    setIsLoading(true);
    try {
      await updateProductQuantity(selectedProduct.id, quantity);
      await queryClient.invalidateQueries({ queryKey: ["restockingProducts"] });
      setQuantity(0);
      setSelectedProduct(null);
      setSearchTerm("");
      toast.success("Thêm số lượng thành công");
      onClose();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Thêm số lượng thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ p: 1.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Nhập hàng
          </Typography>
          <IconButton onClick={onClose} size="small" disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1.5 }}>
        <Stack spacing={2}>
          <Autocomplete
            options={products?.data || []}
            getOptionLabel={(option) => option.name}
            value={selectedProduct}
            onChange={(_, newValue) => {
              setSelectedProduct(newValue as IProduct);
              setQuantity(0);
            }}
            onInputChange={(_, newInputValue) => {
              setSearchTerm(newInputValue);
            }}
            loading={isLoadingProducts}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tìm kiếm sản phẩm"
                size="small"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                    endAdornment: (
                      <>
                        {isLoadingProducts ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box
                  component="img"
                  src={option.images?.[0]}
                  alt={option.name}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: 0.5,
                    mr: 1,
                  }}
                />
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Số lượng hiện tại: {option.quantity}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          {selectedProduct && (
            <>
              <Box
                display="flex"
                gap={2}
                sx={{
                  "& img": {
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                  },
                }}
              >
                <img
                  src={selectedProduct.images?.[0]}
                  alt={selectedProduct.name}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {selectedProduct.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số lượng hiện tại: {selectedProduct.quantity}
                  </Typography>
                </Box>
              </Box>

              <TextField
                label="Số lượng cần thêm"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                fullWidth
                size="small"
                disabled={isLoading}
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1.5 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isLoading}
          sx={{
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={quantity <= 0 || isLoading || !selectedProduct}
          sx={{
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          {isLoading ? "Đang cập nhật..." : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestockModal;
