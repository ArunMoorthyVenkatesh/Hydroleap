import React, { useState, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import seaVideo from "../assets/sea_5.mp4";
import FadeTransition from "./FadeTransition";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const fadeRef = useRef(null);  

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/admin-login/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);
        alert(res.data.message || "Login successful");

        if (fadeRef.current) {
          fadeRef.current("/admin");
        }
      } else {
        throw new Error("No token received from server.");
      }
    } catch (err) {
      console.error("Error during admin login:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <FadeTransition targetPath="/admin" externalTriggerRef={fadeRef}>
      <div style={styles.container}>
        <video autoPlay muted loop style={styles.video}>
          <source src={seaVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <Header />

        <div style={styles.overlay}>
          <h2 style={styles.title}>Admin Login</h2>
          <div style={styles.form}>
            <input
              type="email"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleLogin} style={styles.button}>
              Login
            </button>
            {error && <div style={styles.error}>{error}</div>}
          </div>
        </div>
      </div>
    </FadeTransition>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "'Times New Roman', serif",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(14px) saturate(180%)",
    WebkitBackdropFilter: "blur(14px) saturate(180%)",
    borderRadius: "20px",
    padding: "2.5rem",
    maxWidth: "400px",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#fff",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
    textAlign: "center",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.8rem",
    marginBottom: "1rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    outline: "none",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.1)",
  },
  button: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2f2f2f",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    marginTop: "1rem",
    color: "#ff4d4d",
    fontSize: "0.9rem",
  },
};

export default AdminLoginPage;
