import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

interface ProofProps {
  open: boolean;
  onClose: () => void;
  file: string;
  index: number;
  isImage?: boolean;
}

const Proof = ({ open, onClose, file, index, isImage }: ProofProps) => {
  const [isBlobImage, setIsBlobImage] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBlobType = async () => {
      if (file.startsWith("blob:")) {
        try {
          const response = await fetch(file);
          const blob = await response.blob();
          setIsBlobImage(blob.type.startsWith("image/"));
        } catch (error) {
          console.error("Error checking blob type:", error);
          setIsBlobImage(false);
        }
      } else {
        setIsBlobImage(null);
      }
    };

    checkBlobType();
  }, [file]);

  const checkIsImage =
    file.startsWith("data:image/") ||
    file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    file.includes("cloudinary.com") ||
    isBlobImage === true;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            bgcolor: "transparent",
            boxShadow: "none",
          },
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
          {checkIsImage || isImage ? (
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
