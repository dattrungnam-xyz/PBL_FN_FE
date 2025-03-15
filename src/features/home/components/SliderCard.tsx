import { Box } from "@mui/material";

type SliderCardProps = {
  src: string;
  alt: string;
};

const SliderCard = ({ src, alt }: SliderCardProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Box>
  );
};

export default SliderCard;
