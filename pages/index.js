// pages/index.js
import { useEffect } from "react";
import useSWR from "swr";
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Grid,
  AppBar,
  Toolbar,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useRouter } from "next/router";
import useAuthStore from "../store/store";
import withAuth from "../hoc/withAuth";
import { getProductsAPI } from "./api";
import useCartStore from "@/store/cartStore";
import Link from "next/link";
import axiosInstance from "@/utils/interceptor";

const fetcher = (url, token) =>
  axiosInstance
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

const Home = () => {
  const { token, clearToken } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [token]);

  const { data, error, isLoading } = useSWR(
    token ? [getProductsAPI, token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const handleAddToCart = (product) => {
    let updatedCart = cart ? [...cart] : [];

    const productIndex = updatedCart.findIndex(
      (item) => item.product._id === product._id
    );

    if (productIndex > -1) {
      updatedCart[productIndex].quantity += 1;
    } else {
      updatedCart.push({
        product,
        quantity: 1,
      });
    }

    setCart(updatedCart);
  };

  const handleIncrement = (productId) => {
    const updatedCart = cart.map((item) =>
      item.product._id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
  };

  const handleDecrement = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
  };

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ marginTop: "2rem" }}>
        Failed to load products
      </Typography>
    );

  return (
    <>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Product Listing
          </Typography>
          <Button color="inherit" onClick={() => router.push("/myOrders")}>
            My Orders
          </Button>
          <Button color="inherit" onClick={() => router.push("/cart")}>
            Cart
          </Button>
          <Button color="inherit" onClick={() => handleLogout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Product Grid */}
      <Container
        sx={{
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <Grid container spacing={3}>
          {data?.map((product) => {
            const cartItem = cart?.find(
              (item) => item.product._id === product._id
            );

            return (
              <Grid
                item
                key={product._id}
                sx={{
                  flex: "0 0 330px",
                  maxWidth: "330px",
                  margin: "1rem",
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555", marginBottom: "1rem" }}
                    >
                      {product.description}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#000" }}
                    >
                      ₹ {product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {cartItem ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleDecrement(product._id)}
                        >
                          -
                        </Button>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {cartItem.quantity}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleIncrement(product._id)}
                        >
                          +
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
