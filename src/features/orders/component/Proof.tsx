import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ProofProps {
  open: boolean;
  onClose: () => void;
  file: string;
  index: number;
}

const Proof = ({ open, onClose, file, index }: ProofProps) => {
  const isImage =
    file.startsWith("data:image/") ||
    file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    file.includes("cloudinary.com");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            bgcolor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {isImage ? (
            <img
              src={file}
              alt={`Minh chứng ${index + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          ) : (
            <video
              src={file}
              controls
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Proof;
