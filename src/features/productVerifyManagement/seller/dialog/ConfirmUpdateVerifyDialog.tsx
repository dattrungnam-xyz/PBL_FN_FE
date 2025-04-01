import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmUpdateVerifyDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  keepMounted: boolean;
}

const ConfirmUpdateVerifyDialog = ({
  open,
  onClose,
  keepMounted,
}: ConfirmUpdateVerifyDialogProps) => {
  const handleClose = () => {
    onClose(false);
  };
  const handleConfirm = () => {
    onClose(true);
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted={keepMounted}>
      <DialogTitle>Xác nhận cập nhật yêu cầu xác thực</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn cập nhật yêu cầu xác thực? 
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

export default ConfirmUpdateVerifyDialog;
