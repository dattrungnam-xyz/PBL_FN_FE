import { Box, Dialog, DialogContent, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

interface ProofProps {
  open: boolean;
  onClose: () => void;
  media: {
    type: "image" | "video";
    url: string;
  }[];
  initialIndex?: number;
}

const Proof = ({ open, onClose, media, initialIndex = 0 }: ProofProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isBlobImage, setIsBlobImage] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBlobType = async () => {
      const currentMedia = media[currentIndex];
      if (currentMedia.url.startsWith("blob:")) {
        try {
          const response = await fetch(currentMedia.url);
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
  }, [media, currentIndex]);

  const checkIsImage = (url: string) => {
    return (
      url.startsWith("data:image/") ||
      url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
      url.includes("cloudinary.com") ||
      isBlobImage === true
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
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
            position: "relative",
          }}
        >
          {checkIsImage(media[currentIndex].url) ? (
            <img
              src={media[currentIndex].url}
              alt={`Proof ${currentIndex + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          ) : (
            <video
              src={media[currentIndex].url}
              controls
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            />
          )}

          {media.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  left: 8,
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                {"<"}
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 8,
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                {">"}
              </IconButton>
            </>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {media.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor:
                  currentIndex === index ? "white" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Proof;
