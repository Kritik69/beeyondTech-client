// pages/login.js
import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import useAuthStore from "../store/store";
import { loginAPI } from "./api";
import axiosInstance from "@/utils/interceptor";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setToken, setUser, token } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(loginAPI, { email, password });
      setToken(data.token); // Save the JWT token
      setUser(data.user); // Save the JWT token
      if (data.user.role !== "admin") {
        router.push("/"); // Redirect to home if not admin
      } else {
        router.push("/dashboard"); // Redirect to dashboard if admin
      }
    } catch (err) {
      console.log(err, "login err");
      setError("Invalid credentials");
    }
  };

  useEffect(() => {
    if (token) {
      router.push("/"); // Redirect to dashboard if already logged in
    }
  }, [token]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom color="#333">
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
        <Typography
          align="center"
          sx={{ marginTop: 2, fontSize: "0.9rem", color: "#555" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
