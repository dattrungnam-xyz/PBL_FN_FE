import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmUpdateStoreDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  keepMounted: boolean;
}

const ConfirmUpdateStoreDialog = ({
  open,
  onClose,
  keepMounted,
}: ConfirmUpdateStoreDialogProps) => {
  const handleClose = () => {
    onClose(false);
  };
  const handleConfirm = () => {
    onClose(true);
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted={keepMounted}>
      <DialogTitle>Xác nhận cập nhật</DialogTitle>
      <DialogContent dividers>
        Bạn có chắc chắn muốn cập nhật thông tin cửa hàng?
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

export default ConfirmUpdateStoreDialog;
