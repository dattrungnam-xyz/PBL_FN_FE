import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Storefront as StorefrontIcon,
  LocalPhone as LocalPhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import Content from "../../../layouts/Content";
import { IStore } from "../../../interface";
import { getStoreById } from "../../../services/store.service";
import ProductCard from "../../../components/ProductCard";
import { SellingProductStatus, VerifyOCOPStatus } from "../../../enums";
import storeImage from "../asset/ocopimage.png";
import { getProductByStoreId } from "../../../services/product.service";
import { IProductTableData } from "../../../interface/product.interface";
const Store = () => {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<IStore | null>(null);
  const [products, setProducts] = useState<IProductTableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        if (id) {
          const storeData = await getStoreById(id);
          setStore(storeData);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        if (id) {
          const productsData = await getProductByStoreId(id, {
            page: 1,
            limit: 1000,
            status: SellingProductStatus.SELLING,
          });
          setProducts(productsData.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchStore();
    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <Content>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Content>
    );
  }

  if (!store) {
    return (
      <Content>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography>Store not found</Typography>
        </Box>
      </Content>
    );
  }

  return (
    <Content>
      <Box sx={{ py: 3 }}>
        {/* Store Header */}
        <Card sx={{ mb: 3 }}>
          <Box
            sx={{
              position: "relative",
              height: 200,
              backgroundImage: `url(${store.banner ? store.banner : storeImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: -50,
                left: 20,
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
              }}
            >
              <Avatar
                src={store.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid white",
                }}
              />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {store.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {store.description}
                </Typography>
              </Box>
            </Box>
          </Box>
          <CardContent sx={{ mt: 6 }}>
            <Box sx={{ maxWidth: "50%" }}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StorefrontIcon color="primary" />
                  <Typography>{store.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalPhoneIcon color="primary" />
                  <Typography>{store.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon color="primary" />
                  <Typography>{store.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon color="primary" />
                  <Typography>
                    {store.address}, {store.wardName}, {store.districtName},{" "}
                    {store.provinceName}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Products Section */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Sản phẩm của cửa hàng
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            "& > *": {
              width: {
                xs: "100%",
                sm: "calc(50% - 12px)",
                md: "calc(33.33% - 16px)",
                lg: "calc(25% - 18px)",
              },
            },
          }}
        >
          {products?.map((product) => (
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
              soldCount={product?.orderDetails.reduce(
                (acc, orderDetail) => acc + orderDetail.quantity,
                0,
              ) || 0}
              isVerified={
                product.verifyOcopStatus === VerifyOCOPStatus.VERIFIED
              }
            />
          ))}
        </Box>
      </Box>
    </Content>
  );
};

export default Store;
