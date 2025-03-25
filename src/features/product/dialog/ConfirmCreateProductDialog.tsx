import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmCreateProductDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  keepMounted: boolean;
}

const ConfirmCreateProductDialog = ({
  open,
  onClose,
  keepMounted,
}: ConfirmCreateProductDialogProps) => {
  const handleClose = () => {
    onClose(false);
  };
  const handleConfirm = () => {
    onClose(true);
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted={keepMounted}>
      <DialogTitle>Xác nhận tạo sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn tạo sản phẩm? Sau khi tạo, sản phẩm sẽ được tiến
          hành xác thực OCOP. Quá trình này giúp nâng cao uy tín và tạo niềm tin
          cho khách hàng.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="outlined" onClick={handleClose}>
          Hủy bỏ
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCreateProductDialog;
