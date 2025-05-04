import { Box, SxProps, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type CategoryCardProps = {
  text?: string;
  src: string;
  alt?: string;
  sx?: SxProps;
  value?: string;
};

const CategoryCard = ({ text, src, alt, sx, value }: CategoryCardProps) => {
  const navigate = useNavigate();
  const handleClick = (value: string) => {
    navigate(`/products?category=${value}`);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        ...sx,
        "&:hover img": {
          transform: "scale(1.1)",
        },
        position: "relative",
      }}
      onClick={() => handleClick(value as string)}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transition: "transform 0.3s ease-in-out",
        }}
      />

      {text ? (
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            color: "white",
            p: 1,
          }}
        >
          {text}
        </Typography>
      ) : null}
    </Box>
  );
};

export default CategoryCard;
