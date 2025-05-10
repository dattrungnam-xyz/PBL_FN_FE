import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  Button,
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
import StorefrontIcon from "@mui/icons-material/Storefront";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import {
  getFiveStarProduct,
  getPopularProduct,
} from "../../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { Category, VerifyOCOPStatus } from "../../enums";
import { getTopRecentReviews } from "../../services/review.service";
import { format } from "date-fns";
import ImageDetail from "../../components/ImageDetail";
import { useState } from "react";

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
    value: "all",
  },
  {
    src: Food,
    alt: "food",
    text: "Thực phẩm",
    value: Category.FOOD,
  },
  {
    src: Beverage,
    alt: "beverage",
    text: "Đồ uống",
    value: Category.BEVERAGE,
  },
  {
    src: Herb,
    alt: "herb",
    text: "Thảo dược",
    value: Category.HERB,
  },
  {
    src: HandicraftsDecoration,
    alt: "handicrafts_decoration",
    text: "Đồ trang trí",
    value: Category.HANDICRAFTS_DECORATION,
  },
];

const SellerBenefits = [
  {
    icon: <StorefrontIcon sx={{ fontSize: 40, color: "#fff" }} />,
    title: "Quản lý cửa hàng dễ dàng",
    description: "Công cụ quản lý đơn hàng, sản phẩm và khách hàng trực quan",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#fff" }} />,
    title: "Tăng doanh số bán hàng",
    description: "Tiếp cận hàng triệu khách hàng tiềm năng trên nền tảng",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: "#fff" }} />,
    title: "Thanh toán an toàn",
    description: "Hệ thống thanh toán bảo mật, hỗ trợ đa dạng phương thức",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#fff" }} />,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ hỗ trợ chuyên nghiệp, sẵn sàng giải quyết mọi vấn đề",
  },
];

const HomePage = () => {
  const { data: products } = useQuery({
    queryKey: ["five-star-product"],
    queryFn: () => getFiveStarProduct(),
  });

  const { data: popularProducts } = useQuery({
    queryKey: ["popular-product"],
    queryFn: () => getPopularProduct(),
  });

  const { data: recentReviews } = useQuery({
    queryKey: ["top-recent-reviews"],
    queryFn: () => getTopRecentReviews(),
  });

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isImageDetailOpen, setIsImageDetailOpen] = useState(false);

  const handleMediaClick = (mediaUrl: string, allMedia: string[]) => {
    setSelectedMedia(mediaUrl);
    setMediaList(allMedia);
    setIsImageDetailOpen(true);
  };

  const handleCloseImageDetail = () => {
    setIsImageDetailOpen(false);
    setSelectedMedia(null);
    setMediaList([]);
  };

  const handleNextMedia = () => {
    if (selectedMedia && mediaList.length > 0) {
      const currentIndex = mediaList.indexOf(selectedMedia);
      const nextIndex = (currentIndex + 1) % mediaList.length;
      setSelectedMedia(mediaList[nextIndex]);
    }
  };

  const handlePrevMedia = () => {
    if (selectedMedia && mediaList.length > 0) {
      const currentIndex = mediaList.indexOf(selectedMedia);
      const prevIndex =
        (currentIndex - 1 + mediaList.length) % mediaList.length;
      setSelectedMedia(mediaList[prevIndex]);
    }
  };

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
                  value={item.value}
                />
              ))}
            </Box>
          </Box>
        </Box>
        {popularProducts && popularProducts.length > 0 ? (
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
                {popularProducts?.map((product) => (
                  <Box sx={{ p: 0.5 }}>
                    <ProductCard
                      id={product.id}
                      key={product.id}
                      name={product.name}
                      price={product.price}
                      rating={
                        product.reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0,
                        ) / (product.reviews.length || 1)
                      }
                      ocopRating={product.star}
                      location={product.seller.provinceName}
                      image={product.images[0]}
                      soldCount={product?.soldCount || 0}
                      isVerified={
                        product.verifyOcopStatus === VerifyOCOPStatus.VERIFIED
                      }
                    />
                  </Box>
                ))}
              </Carousel>
            </Box>
          </Box>
        ) : null}
        {products && products.length > 0 ? (
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
                {products?.map((product) => (
                  <Box sx={{ p: 0.5 }}>
                    <ProductCard
                      id={product.id}
                      key={product.id}
                      name={product.name}
                      price={product.price}
                      rating={
                        product.reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0,
                        ) / (product.reviews.length || 1)
                      }
                      ocopRating={product.star}
                      location={product.seller.provinceName}
                      image={product.images[0]}
                      soldCount={product?.soldCount || 0}
                      isVerified={
                        product.verifyOcopStatus === VerifyOCOPStatus.VERIFIED
                      }
                    />
                  </Box>
                ))}
              </Carousel>
            </Box>
          </Box>
        ) : null}

        {recentReviews && recentReviews.length > 0 && (
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
                {recentReviews?.map((review, idx) => (
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
                          <Avatar src={review.user.avatar} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {review.user.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {format(new Date(review.createdAt), "dd/MM/yyyy")}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight={500}
                        >
                          {review.product.name} - {review.orderDetail?.quantity}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {review.description}
                        </Typography>
                        {review.media && review.media.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              overflowX: "auto",
                              py: 1,
                            }}
                          >
                            {review.media.map((mediaUrl, mediaIdx) => (
                              <Box
                                key={mediaIdx}
                                onClick={() =>
                                  handleMediaClick(mediaUrl, review.media)
                                }
                                sx={{
                                  cursor: "pointer",
                                  position: "relative",
                                  minWidth: "100px",
                                  height: "100px",
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  "&:hover": {
                                    opacity: 0.8,
                                  },
                                }}
                              >
                                {mediaUrl.endsWith(".mp4") ||
                                mediaUrl.endsWith(".webm") ? (
                                  <video
                                    src={mediaUrl}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={mediaUrl}
                                    alt={`Review media ${mediaIdx + 1}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: { xs: 1, sm: 2 },
            maxHeight: "100%",
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(135deg,rgb(46, 158, 52) 0%,rgb(25, 119, 31) 100%)",
              borderRadius: 2,
              mt: 1,
              p: { xs: 2, sm: 4 },
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                zIndex: 1,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(45deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
                zIndex: 1,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                color: "white",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Trở thành người bán hàng OCOP
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  maxWidth: "800px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                Khám phá cơ hội kinh doanh cùng nền tảng thương mại điện tử hàng
                đầu
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mb: 4,
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  bgcolor: "#fff",
                  color: "#2E7D32",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  "&:hover": {
                    bgcolor: "#fff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Đăng ký ngay
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
                mt: 2,
                position: "relative",
                zIndex: 2,
              }}
            >
              {SellerBenefits.map((benefit, index) => (
                <Box
                  key={index}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      bgcolor: "rgba(255,255,255,0.12)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {benefit.icon}
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 1,
                      mb: 1,
                      fontWeight: 600,
                      color: "#fff",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <ImageDetail
        open={isImageDetailOpen}
        onClose={handleCloseImageDetail}
        currentMedia={selectedMedia || ""}
        mediaList={mediaList}
        onNext={handleNextMedia}
        onPrev={handlePrevMedia}
      />
    </Content>
  );
};

export default HomePage;
