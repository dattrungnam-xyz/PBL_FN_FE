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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { IProduct } from "../../../interface";
import { useQueryClient } from "@tanstack/react-query";
import { updateProductQuantity } from "../../../services/product.service";
import { toast } from "react-toastify"; 
interface UpdateQuantityModalProps {
  open: boolean;
  onClose: () => void;
  product: IProduct;
}

const UpdateQuantityModal = ({
  open,
  onClose,
  product,
}: UpdateQuantityModalProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (quantity <= 0) return;

    setIsLoading(true);
    try {
      await updateProductQuantity(product.id, quantity);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setQuantity(0);
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
            Cập nhật số lượng
          </Typography>
          <IconButton onClick={onClose} size="small" disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1.5 }}>
        <Stack spacing={2}>
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
            <img src={product.images?.[0]} alt={product.name} />
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Số lượng hiện tại: {product.quantity}
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
          disabled={quantity <= 0 || isLoading}
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

export default UpdateQuantityModal;
