import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

interface ImageDetailProps {
  open: boolean;
  onClose: () => void;
  currentMedia: string;
  mediaList: string[];
  onNext: () => void;
  onPrev: () => void;
}

const ImageDetail = ({
  open,
  onClose,
  currentMedia,
  mediaList,
  onNext,
  onPrev,
}: ImageDetailProps) => {
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    const checkMediaType = async () => {
      if (currentMedia.startsWith("data:")) {
        // Check data URL type
        if (currentMedia.startsWith("data:image")) {
          setMediaType("image");
        } else if (currentMedia.startsWith("data:video")) {
          setMediaType("video");
        }
      } else if (currentMedia.startsWith("blob:")) {
        // Check blob type
        try {
          const response = await fetch(currentMedia);
          const blob = await response.blob();
          if (blob.type.startsWith("image/")) {
            setMediaType("image");
          } else if (blob.type.startsWith("video/")) {
            setMediaType("video");
          }
        } catch (error) {
          console.error("Error checking blob type:", error);
          setMediaType(null);
        }
      } else {
        // Check file extension
        const videoExtensions = [".mp4", ".webm", ".ogg"];
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const lowerUrl = currentMedia.toLowerCase();

        if (videoExtensions.some((ext) => lowerUrl.endsWith(ext))) {
          setMediaType("video");
        } else if (imageExtensions.some((ext) => lowerUrl.endsWith(ext))) {
          setMediaType("image");
        } else {
          setMediaType(null);
        }
      }
    };

    checkMediaType();
  }, [currentMedia]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(0, 0, 0, 0.2)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {mediaList.length > 1 && (
          <>
            <IconButton
              onClick={onPrev}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.2)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={onNext}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.2)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            bgcolor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {mediaType === "image" ? (
            <img
              src={currentMedia}
              alt="Media content"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          ) : mediaType === "video" ? (
            <video
              src={currentMedia}
              controls
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography color="white">Không thể hiển thị nội dung</Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetail;
