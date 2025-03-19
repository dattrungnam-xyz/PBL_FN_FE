import { Box, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { CategoryCard, SliderCard } from "./components";
import { Content } from "../../layouts";
import ProductSlider1 from "./assets/product_slider_1.jpeg";
import ProductSlider2 from "./assets/product_slider_2.jpeg";
import RegionSlider1 from "./assets/region_slider_1.jpeg";
import RegionSlider2 from "./assets/region_slider_2.jpeg";
import RegionSlider3 from "./assets/region_slider_3.jpeg";
import AllProduct from "./assets/all_product.jpeg";
import Food from "./assets/food.jpeg";
import Beverage from "./assets/beverage.jpeg";
import Herb from "./assets/herb.png";
import HandicraftsDecoration from "./assets/handicrafts_decoration.jpeg";
import ProductCard from "../../components/ProductCard";

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

const CategoryItems = [
  {
    src: AllProduct,
    alt: "all_product",
    text: "Tất cả sản phẩm",
  },
  {
    src: Food,
    alt: "food",
    text: "Thực phẩm",
  },
  {
    src: Beverage,
    alt: "beverage",
    text: "Đồ uống",
  },
  {
    src: Herb,
    alt: "herb",
    text: "Thảo dược",
  },
  {
    src: HandicraftsDecoration,
    alt: "handicrafts_decoration",
    text: "Đồ trang trí",
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
            mt: 2,
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
          <Box
            sx={{
              p: { xs: 0, sm: 1 },
              bgcolor: "background.paper",
              borderRadius: 2,
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(5, 1fr)",
                  lg: "repeat(5, 1fr)",
                },
                gap: 1,
                mt: 1,
              }}
            >
              {CategoryItems.map((item, idx) => (
                <CategoryCard
                  key={idx}
                  src={item.src}
                  alt={item.alt}
                  text={item.text}
                />
              ))}
            </Box>
          </Box>
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
            Sản phẩm nổi bật
          </Typography>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              mt: 1,
            }}
          >
            <Carousel
              sx={{ p: { xs: 0, sm: 1 } }}
              stopAutoPlayOnHover
              indicators={false}
              autoPlay
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  gap: { xs: 0.5, sm: 1 },
                  justifyItems: "center",
                }}
              >
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  gap: { xs: 0.5, sm: 1 },
                  justifyItems: "center",
                }}
              >
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 2"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
              </Box>
            </Carousel>
          </Box>
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
            Sản phẩm OCOP 5 sao
          </Typography>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              mt: 1,
            }}
          >
            <Carousel
              sx={{ p: { xs: 0, sm: 1 } }}
              stopAutoPlayOnHover
              indicators={false}
              autoPlay
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  gap: { xs: 0.5, sm: 1 },
                  justifyItems: "center",
                }}
              >
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  gap: { xs: 0.5, sm: 1 },
                  justifyItems: "center",
                }}
              >
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 2"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                />
              </Box>
            </Carousel>
          </Box>
        </Box>
      </Box>
    </Content>
  );
};
export default HomePage;
