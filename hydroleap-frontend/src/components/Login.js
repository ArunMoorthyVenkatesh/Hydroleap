import React, { useState, useRef } from "react";
import { loginUser } from "../api";
import Header from "./Header";
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

const ACCENT = "#21c6bc";
const styles = {
  wrapper: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Times New Roman, serif",
    background: "linear-gradient(135deg, #e3fbfa 0%, #fafdff 100%)",
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: "#222",
  },
  centerWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backdropFilter: "blur(13px) saturate(170%)",
    WebkitBackdropFilter: "blur(13px) saturate(170%)",
    background: "rgba(255,255,255,0.91)",
    borderRadius: "15px",
    padding: "2rem",
    width: "350px",
    boxShadow: "0 8px 30px 0 #b0f2ee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeIn 1s ease forwards",
    border: "1.5px solid #e0fcfa",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    fontFamily: "Georgia, serif",
    color: ACCENT,
    letterSpacing: ".01em",
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
    border: "1.5px solid #b7f4ee",
    backgroundColor: "#f7fefe",
    color: "#185754",
    marginBottom: "1rem",
    outline: "none",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "0.75rem 1rem",
    background: "linear-gradient(90deg, #21c6bc, #8feee6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s",
    boxShadow: "0 2px 10px #b0ece8",
    letterSpacing: ".02em",
  },
  orText: {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#8fc1bb",
    margin: "1rem 0",
  },
  error: {
    fontSize: "0.85rem",
    color: "#ff6f7d",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
};

export default Login;
