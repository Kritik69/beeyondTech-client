import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import withAuth from "../hoc/withAuth";
import { io } from "socket.io-client";
import { baseUrl, getOrdersAPI } from "./api";
import axiosInstance from "@/utils/interceptor";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Delivered, 1: Pending, 2: Cancelled

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const statusQuery =
          selectedTab === 0
            ? "Delivered"
            : selectedTab === 1
            ? "Pending"
            : "Cancelled";
        const response = await axiosInstance.get(
          `${getOrdersAPI}?status=${statusQuery}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedTab]);

  useEffect(() => {
    const socket = io(
      "https://beeyondtech-server-562780667822.us-central1.run.app"
    );

    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    socket.on("newOrder", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (loading) return <CircularProgress />;

  return (
    <Container
      sx={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" color="black" gutterBottom align="center">
        Admin Orders
      </Typography>

      {/* Tabs for filtering orders */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: "1rem" }}
      >
        <Tab label="Delivered Orders" />
        <Tab label="Pending Orders" />
        <Tab label="Cancelled Orders" />
      </Tabs>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user?.email || "N/A"}</TableCell>
                  <TableCell>₹ {order.totalPrice}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={order.status || "Pending"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await axiosInstance.put(
                              `${baseUrl}orders/${order._id}/status`,
                              {
                                status: newStatus,
                              }
                            );
                            const updated = res.data;
                            setOrders((prev) =>
                              prev.map((o) =>
                                o._id === updated._id ? updated : o
                              )
                            );
                          } catch (err) {
                            console.error("Failed to update status", err);
                          }
                        }}
                        disabled={selectedTab !== 1} // Disable dropdown for non-pending orders
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default withAuth(AdminOrders);
