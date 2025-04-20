import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";

interface RejectVerifyModalProps {
  open: boolean;
  onClose: (confirm: boolean, reason?: string) => void;
  title?: string;
}

const RejectVerifyModal = ({
  open,
  onClose,
  title = "Từ chối phê duyệt OCOP",
}: RejectVerifyModalProps) => {
  const [reason, setReason] = useState("");

  const handleClose = (confirm: boolean) => {
    if (confirm) {
      onClose(true, reason);
    } else {
      onClose(false);
    }
    setReason("");
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Lý do từ chối"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do từ chối phê duyệt OCOP..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Hủy</Button>
        <Button
          onClick={() => handleClose(true)}
          variant="contained"
          color="error"
          disabled={!reason.trim()}
        >
          Từ chối
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectVerifyModal;
