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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          backgroundColor: "#f5f5f5",
        }}
      />
    </Box>
  );
};

export default SliderCard;
