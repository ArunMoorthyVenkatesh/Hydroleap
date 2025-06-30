import React, { useState, useRef } from "react";
import { loginUser } from "../api";
import Header from "./Header";
import seaVideo from "../assets/sea_3.mp4";
import FadeTransition from "./FadeTransition";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const triggerFadeRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if (!emailRegex.test(form.email.trim()))
      newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ email: form.email }));
      localStorage.setItem("userEmail", form.email.trim().toLowerCase()); // ✅ important fix

      if (triggerFadeRef.current) {
        triggerFadeRef.current("/user-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed.");
    }
  };

  return (
    <FadeTransition targetPath="/user-dashboard" externalTriggerRef={triggerFadeRef}>
      <div style={styles.wrapper}>
        <video autoPlay loop muted playsInline style={styles.video}>
          <source src={seaVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div style={styles.overlay}>
          <Header />
          <div style={styles.centerWrapper}>
            <div style={styles.container}>
              <h2 style={styles.title}>Login</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                />
                {errors.email && <div style={styles.error}>{errors.email}</div>}

                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                />
                {errors.password && (
                  <div style={styles.error}>{errors.password}</div>
                )}

                <button type="submit" style={styles.button}>
                  Login as User
                </button>
              </form>

              <p style={styles.orText}>Or</p>

              <button
                onClick={() => {
                  if (triggerFadeRef.current) {
                    triggerFadeRef.current("/admin-login");
                  } else {
                    navigate("/admin-login");
                  }
                }}
                style={{ ...styles.button, backgroundColor: "#555" }}
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </FadeTransition>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Times New Roman, serif",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
  },
  centerWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "15px",
    padding: "2rem",
    width: "350px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeIn 1s ease forwards",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    fontFamily: "Georgia, serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    fontFamily: "inherit",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    marginBottom: "1rem",
    outline: "none",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "0.75rem 1rem",
    backgroundColor: "#ffffff33",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s",
  },
  orText: {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#ddd",
    margin: "1rem 0",
  },
  error: {
    fontSize: "0.85rem",
    color: "salmon",
    marginBottom: "0.5rem",
  },
};

export default Login;
