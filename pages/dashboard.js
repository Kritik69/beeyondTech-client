// pages/dashboard.js
import { useEffect } from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import useAuthStore from "../store/store";
import withAuth from "../hoc/withAuth";

const Dashboard = () => {
  const { token, clearToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [token]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/adminOrders")}
        sx={{ marginTop: "1rem" }}
      >
        Orders
      </Button>
    </Container>
  );
};

export default withAuth(Dashboard);
