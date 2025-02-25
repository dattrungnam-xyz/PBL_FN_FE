import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Stack } from "@mui/material";

interface Props {
  children: ReactNode;
  withoutFooter?: boolean;
}

const Content: React.FC<Props> = ({ children, withoutFooter = false }) => (
  <Stack sx={{ minHeight: "100vh" }}>
    <Header />
    <main style={{ flexGrow: 1 }}>{children}</main>
    {!withoutFooter && <Footer />}
  </Stack>
);

export default Content;
