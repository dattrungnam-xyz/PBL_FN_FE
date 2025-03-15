import { Box, Paper, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";

import { CategoryCard, SliderCard } from "./components";
import { Content } from "../../layouts";

import ProductSlider1 from "./assets/product_slider_1.jpeg";
import ProductSlider2 from "./assets/product_slider_2.jpeg";
import RegionSlider1 from "./assets/region_slider_1.jpeg";
import RegionSlider2 from "./assets/region_slider_2.jpeg";
import RegionSlider3 from "./assets/region_slider_3.jpeg";
import AllProduct from "./assets/all_product.jpeg";

const ProductItems = [
  {
    src: ProductSlider1,
    alt: "product_slider_1",
  },
  {
    src: ProductSlider2,
    alt: "product_slider_2",
  },
];

const RegionItems = [
  {
    src: RegionSlider1,
    alt: "region_slider_1",
  },
  {
    src: RegionSlider2,
    alt: "region_slider_2",
  },
  {
    src: RegionSlider3,
    alt: "region_slider_3",
  },
];

const HomePage = () => {
  return (
    <Content
      sx={{
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: { xs: 0.5, sm: 2 },
          }}
        >
          <Carousel indicators={false} autoPlay>
            {ProductItems.map((item, index) => (
              <SliderCard key={index} src={item.src} alt={item.alt} />
            ))}
          </Carousel>
          <Carousel indicators={false} autoPlay>
            {RegionItems.map((item, index) => (
              <SliderCard key={index} src={item.src} alt={item.alt} />
            ))}
          </Carousel>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: { xs: 1, sm: 2 },
            maxHeight: "100%",
          }}
        >
          <Typography color="text.primary" variant="h5">
            Danh mục sản phẩm
          </Typography>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              mt: 1,
              boxShadow: "unset",
              borderRadius: 2,
              bgColor: "background.paper",
              maxHeight: "200px",
              gap: 1,
            }}
          >
            <CategoryCard
              text="Tất cả sản phẩm"
              src={AllProduct}
              alt="All product"
            />
          </Paper>
        </Box>
      </Box>
      ;
    </Content>
  );
};
export default HomePage;
