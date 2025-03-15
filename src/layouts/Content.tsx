import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Stack, SxProps } from "@mui/material";

// Định nghĩa kiểu cho props
interface Props {
  children: ReactNode;
  withoutFooter?: boolean;
  sx?: SxProps;
}

const Content: React.FC<Props> = ({ children, withoutFooter = false, sx }) => (
  <Stack sx={{ minHeight: "100vh" }}>
    <Header />
    <Box
      sx={{ display: "flex", justifyContent: "center", flexGrow: 1, ...sx }}
      component="main"
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1300px",
          px: { md: 2, sm: 1, xs: 0.5 },
        }}
      >
        {children}
      </Box>
    </Box>
    {!withoutFooter && <Footer />}
  </Stack>
);

export default Content;
