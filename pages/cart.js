import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import useAuthStore from "../store/store";
import useCartStore from "@/store/cartStore";
import axiosInstance from "@/utils/interceptor";
import { createOrderAPI } from "./api";

const Cart = () => {
  const { token, user } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => {
    return (
      cart?.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0
      ) || 0
    ); // Default to 0 if cart is empty or undefined
  };

  const calculateTax = () => {
    const total = calculateTotal();
    return (total + 50) * 0.18; // Default tax calculation
  };

  const createOrder = async () => {
    const itemsPrice = calculateTotal();
    const shippingPrice = 50;
    const taxPrice = ((itemsPrice + shippingPrice) * 0.18).toFixed(2);
    const totalPrice = (
      itemsPrice +
      shippingPrice +
      parseFloat(taxPrice)
    ).toFixed(2);

    const orderData = {
      user: user._id,
      orderItems: cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: user.name,
        address: user.address,
      },
      paymentMethod: "prepaid",
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice,
      totalPrice: totalPrice,
      status: "Pending",
      isPaid: true,
      isDelivered: false,
    };

    try {
      const response = await axiosInstance.post(createOrderAPI, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setCart([]); // Clear the cart after order creation
      router.push(`/myOrders`); // Redirect to order confirmation page
    } catch (error) {
      console.error("Error creating order", error);
    }
  };

  const handleCheckout = () => {
    setOpenDialog(true); // Open the payment dialog
  };

  const handlePayment = async () => {
    setIsProcessing(true); // Simulate payment processing
    setTimeout(async () => {
      setIsProcessing(false);
      setOpenDialog(false); // Close the dialog
      await createOrder(); // Call the createOrder function
    }, 2000); // Simulate a 2-second payment process
  };

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [token]);

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

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item.product._id !== productId);
    setCart(updatedCart);
  };

  if (cart?.length === 0) {
    return (
      <Container
        sx={{
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <Typography align="center" sx={{ color: "#999", marginTop: "2rem" }}>
          Your cart is empty.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "2rem" }}
          onClick={() => router.push("/")}
        >
          Go to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#333", fontWeight: "bold" }}
      >
        Your Cart
      </Typography>

      {/* Cart Items */}
      <Grid container spacing={3}>
        {cart?.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.product._id}>
            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f7f7f7",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#333", fontWeight: "bold" }}
              >
                {item.product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", marginBottom: "0.5rem" }}
              >
                {item.product.description}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "#000", fontWeight: "bold", marginTop: "auto" }}
              >
                ₹ {item.product.price}
              </Typography>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleDecrement(item.product._id)}
                >
                  -
                </Button>

                <Typography
                  sx={{ margin: "0 1rem", fontWeight: "bold", color: "#333" }}
                >
                  {item.quantity}
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleIncrement(item.product._id)}
                >
                  +
                </Button>
              </div>

              <Button
                variant="outlined"
                color="error"
                sx={{ marginTop: "1rem" }}
                onClick={() => handleRemoveItem(item.product._id)}
              >
                Remove
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>

      {/* Price Breakdown */}
      <Typography
        variant="h5"
        sx={{ marginTop: "2rem", fontWeight: "bold", color: "#333" }}
      >
        Price Breakdown
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
        <Table>
          <TableBody>
            {cart?.map((item) => (
              <TableRow key={item.product._id}>
                <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                  {item.product.name}
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  ₹ {item.product.price} x {item.quantity} = ₹{" "}
                  {(item.product.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Subtotal
              </TableCell>
              <TableCell align="right" sx={{ color: "#000" }}>
                ₹ {calculateTotal()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Shipping
              </TableCell>
              <TableCell align="right" sx={{ color: "#000" }}>
                ₹ 50.00
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Tax (18%)
              </TableCell>
              <TableCell align="right" sx={{ color: "#000" }}>
                ₹ {calculateTax()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Total
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", color: "#000" }}
              >
                ₹{" "}
                {(calculateTotal() + 50 + parseFloat(calculateTax())).toFixed(
                  2
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Proceed to Checkout Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Button
          onClick={handleCheckout}
          variant="contained"
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          Proceed to Checkout
        </Button>
      </div>

      {/* Payment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Payment Gateway</DialogTitle>
        <DialogContent>
          {isProcessing ? (
            <CircularProgress />
          ) : (
            <Typography>Processing your payment...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {!isProcessing && (
            <Button onClick={handlePayment} variant="contained" color="primary">
              Pay Now
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;
