import React, { useState, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import FadeTransition from "./FadeTransition";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const fadeRef = useRef(null);  

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://54.165.244.9:5001/api/admin-login/login", {
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

const ACCENT = "#21c6bc";
const WHITE = "#ffffff";

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "'Times New Roman', serif",
    background: "linear-gradient(135deg, #e3fbfa 0%, #fafdff 100%)",
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
    background: "rgba(255, 255, 255, 0.92)",
    backdropFilter: "blur(15px) saturate(175%)",
    WebkitBackdropFilter: "blur(15px) saturate(175%)",
    borderRadius: "20px",
    padding: "2.5rem",
    maxWidth: "400px",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#222",
    boxShadow: "0 10px 36px 0 #a3edea",
    textAlign: "center",
    border: "1.5px solid #e0fcfa",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: ACCENT,
    letterSpacing: ".01em",
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
    border: "1.5px solid #b7f4ee",
    outline: "none",
    backgroundColor: "#f7fefe",
    color: "#185754",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 1px 2px #edfcfb",
  },
  button: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #21c6bc, #85ede5 100%)",
    color: WHITE,
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.3s",
    boxShadow: "0 2px 8px #b0ece8",
    marginTop: "0.5rem",
    letterSpacing: ".02em",
  },
  error: {
    marginTop: "1rem",
    color: "#ff8383",
    fontSize: "0.9rem",
    fontWeight: 600,
  },
};


export default AdminLoginPage;
