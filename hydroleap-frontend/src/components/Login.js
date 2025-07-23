import React, { useState, useRef } from "react";
import { loginUser } from "../api";
import Header from "./Header";
import FadeTransition from "./FadeTransition";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ email: form.email }));
      localStorage.setItem("userEmail", form.email.trim().toLowerCase());

      if (triggerFadeRef.current) {
        triggerFadeRef.current("/user-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeTransition targetPath="/user-dashboard" externalTriggerRef={triggerFadeRef}>
      <div style={styles.wrapper}>
        <div style={styles.overlay}>
          <Header />
          <div style={styles.centerWrapper}>
            <div style={styles.container}>
              <div style={styles.titleGroup}>
                <div style={styles.title}>Hydroleap</div>
                <div style={{ ...styles.title, marginTop: "0.2rem" }}>User Login</div>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                />
                {errors.email && <div style={styles.error}>{errors.email}</div>}

                <div style={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      backgroundColor: "#ffffcc",
                      paddingRight: "2.75rem",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "1rem",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      lineHeight: "1",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? "🙈" : "🐵"}
                  </span>
                </div>
                {errors.password && <div style={styles.error}>{errors.password}</div>}

                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? "Logging in..." : "Login as User"}
                </button>
              </form>

              <p style={styles.orText}>Or</p>

              <button
                onClick={() =>
                  triggerFadeRef.current
                    ? triggerFadeRef.current("/admin-login")
                    : navigate("/admin-login")
                }
                style={styles.button}
              >
                Login as Admin
              </button>

              <button
                onClick={() => (window.location.href = "http://localhost:3000/choose")}
                style={styles.button}
              >
                ← Back
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
  titleGroup: {
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
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
    width: "100%",
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
    boxSizing: "border-box",
  },
  button: {
    padding: "0.75rem 1rem",
    background: "linear-gradient(90deg, #21c6bc, #8feee6)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s",
    boxShadow: "0 2px 10px #b0ece8",
    letterSpacing: ".02em",
    marginTop: "0.5rem",
  },
  orText: {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#8fc1bb",
    margin: "1rem 0 0.5rem",
  },
  error: {
    fontSize: "0.85rem",
    color: "#ff6f7d",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
};

export default Login;
