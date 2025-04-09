import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  keepMounted: boolean;
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
}

const ConfirmDialog = ({
  open,
  onClose,
  keepMounted,
  title,
  content,
  confirmText,
  cancelText,
}: ConfirmDialogProps) => {
  const handleClose = () => {
    onClose(false);
  };
  const handleConfirm = () => {
    onClose(true);
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted={keepMounted}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="outlined" onClick={handleClose}>
          {cancelText}
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
