import { useEffect } from "react";
import useSWR from "swr";
import {
  Container,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import useAuthStore from "@/store/store";
import withAuth from "@/hoc/withAuth";
import { getMyOrdersAPI } from "./api";
import { io } from "socket.io-client";
import moment from "moment";
import axiosInstance from "@/utils/interceptor";

const fetcher = (url, token) =>
  axiosInstance
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

const MyOrders = () => {
  const { token, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  useEffect(() => {
    const socket = io("http://localhost:5000"); // Replace with your backend URL

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("orderStatusUpdated", (updatedOrder) => {
      console.log("Order updated:", updatedOrder);
    });

    socket.on("newOrder", (newOrder) => {
      console.log("New order placed:", newOrder);
    });

    return () => socket.disconnect();
  }, []);

  const { data, error, isLoading } = useSWR(
    token ? [getMyOrdersAPI(user._id), token] : null,
    ([url, token]) => fetcher(url, token)
  );

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
        Failed to load your orders.
      </Typography>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Confirmed":
        return "blue";
      case "Shipped":
        return "purple";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              cursor: "pointer",
              color: "#fff",
            }}
            onClick={() => router.push("/")}
          >
            My Orders
          </Typography>
          <Button color="inherit" onClick={() => router.push("/")}>
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          minHeight: "100vh",
          padding: "2rem",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#000" }}
        >
          My Orders
        </Typography>

        {data?.length > 0 ? (
          <List>
            {data.map((order) => (
              <Box
                key={order._id}
                sx={{
                  border: "1px solid #ddd",
                  margin: "1rem",
                  borderRadius: "8px",
                }}
              >
                <ListItem
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: getStatusColor(order.status),
                        color: "#fff",
                      }}
                    >
                      {order.status[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "#000", fontWeight: "bold" }}>
                        Order Total: ₹{order.totalPrice}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: "#000" }}>
                        Ordered on:{" "}
                        {moment(order.createdAt).format("MMMM Do YYYY, h:mm A")}
                      </Typography>
                    }
                  />
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: getStatusColor(order.status),
                      marginLeft: "1rem",
                    }}
                  >
                    {order.status}
                  </Typography>
                </ListItem>
                <Divider />
                <Box sx={{ padding: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "#000" }}
                  >
                    Products:
                  </Typography>
                  {order.orderItems.map((item, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{ marginLeft: "1rem", color: "#000" }}
                    >
                      {item.product.name} - Quantity: {item.quantity}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </List>
        ) : (
          <Typography align="center" sx={{ color: "#999", marginTop: "2rem" }}>
            You have no orders yet.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default MyOrders;
