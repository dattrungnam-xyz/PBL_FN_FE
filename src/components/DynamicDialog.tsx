import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface DynamicDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  keepMounted: boolean;
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  type: "confirm" | "alert";
}

const DynamicDialog = ({
  open,
  onClose,
  keepMounted,
  title,
  content,
  confirmText,
  cancelText,
  type = "confirm",
}: DynamicDialogProps) => {
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
        <Button
          color={type === "confirm" ? "success" : "error"}
          variant="contained"
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicDialog;
