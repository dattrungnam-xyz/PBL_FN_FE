import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
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
import IntroduceCarousel from "./components/IntroduceCarousel";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

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

const ReviewItems = [
  {
    avatar: ProductSlider1,
    name: "Nguyễn Văn A",
    rating: 5,
    comment:
      "Sản phẩm rất tốt, chất lượng cao. Giao hàng nhanh chóng và đóng gói cẩn thận.",
    product: "Mật ong rừng U Minh",
    date: "20/03/2024",
  },
  {
    avatar: ProductSlider1,
    name: "Trần Thị B",
    rating: 4.5,
    comment: "Sản phẩm đúng như mô tả, giá cả hợp lý. Sẽ ủng hộ thêm.",
    product: "Trà thảo dược",
    date: "18/03/2024",
  },
  {
    avatar: ProductSlider1,
    name: "Lê Văn C",
    rating: 5,
    comment:
      "Rất hài lòng với chất lượng sản phẩm. Đóng gói đẹp, giao hàng nhanh.",
    product: "Mật ong rừng U Minh",
    date: "15/03/2024",
  },
  {
    avatar: ProductSlider1,
    name: "Lê Văn C",
    rating: 5,
    comment:
      "Rất hài lòng với chất lượng sản phẩm. Đóng gói đẹp, giao hàng nhanh.",
    product: "Mật ong rừng U Minh",
    date: "15/03/2024",
  },
  {
    avatar: ProductSlider1,
    name: "Lê Văn C",
    rating: 5,
    comment:
      "Rất hài lòng với chất lượng sản phẩm. Đóng gói đẹp, giao hàng nhanh.",
    product: "Mật ong rừng U Minh",
    date: "15/03/2024",
  },
  {
    avatar: ProductSlider1,
    name: "Lê Văn C",
    rating: 5,
    comment:
      "Rất hài lòng với chất lượng sản phẩm. Đóng gói đẹp, giao hàng nhanh.",
    product: "Mật ong rừng U Minh",
    date: "15/03/2024",
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
          <IntroduceCarousel>
            {ProductItems.map((item, index) => (
              <SliderCard key={index} src={item.src} alt={item.alt} />
            ))}
          </IntroduceCarousel>
          <IntroduceCarousel>
            {RegionItems.map((item, index) => (
              <SliderCard key={index} src={item.src} alt={item.alt} />
            ))}
          </IntroduceCarousel>
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
                  md: "repeat(4, 1fr)",
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
              py: 2,
              px: 1,
            }}
          >
            <Carousel
              removeArrowOnDeviceType={[
                "superLargeDesktop",
                "desktop",
                "tablet",
                "mobile",
              ]}
              infinite
              autoPlay
              responsive={responsive}
            >
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
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
              py: 2,
              px: 1,
            }}
          >
            <Carousel
              removeArrowOnDeviceType={[
                "superLargeDesktop",
                "desktop",
                "tablet",
                "mobile",
              ]}
              infinite
              autoPlay
              responsive={responsive}
            >
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
                />
              </Box>
              <Box sx={{ p: 0.25 }}>
                <ProductCard
                  image={ProductSlider1}
                  name="Sản phẩm 1"
                  price={100000}
                  rating={4.5}
                  location="Hà Nội"
                  soldCount={100}
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
            Đánh giá sản phẩm OCOP
          </Typography>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              mt: 1,
              py: 2,
              px: 1,
            }}
          >
            <Carousel
              removeArrowOnDeviceType={[
                "superLargeDesktop",
                "desktop",
                "tablet",
                "mobile",
              ]}
              infinite
              autoPlay
              responsive={responsive}
            >
              {/* {[1, 2].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                > */}
              {ReviewItems.map((review, idx) => (
                <Card key={idx} sx={{ height: "100%", m: 0.25 }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Avatar src={review.avatar} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {review.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {review.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={500}
                      >
                        {review.product}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              {/* </Box>
              ))} */}
            </Carousel>
          </Box>
        </Box>
      </Box>
    </Content>
  );
};
export default HomePage;
