import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmDeleteVerifyDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  keepMounted: boolean;
}

const ConfirmDeleteVerifyDialog = ({
  open,
  onClose,
  keepMounted,
}: ConfirmDeleteVerifyDialogProps) => {
  const handleClose = () => {
    onClose(false);
  };
  const handleConfirm = () => {
    onClose(true);
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted={keepMounted}>
      <DialogTitle>Xác nhận xóa yêu cầu xác thực</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xóa yêu cầu xác thực này? Hành động này không
          thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="outlined" onClick={handleClose}>
          Hủy bỏ
        </Button>
        <Button variant="contained" color="error" onClick={handleConfirm}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteVerifyDialog;
