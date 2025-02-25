import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/system";

// Custom Link suppressed the default <a> style
const Link = styled(RouterLink)({
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "none",
  },
});

export default Link;
