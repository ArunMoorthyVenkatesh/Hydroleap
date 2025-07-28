import React, { useState, useRef } from "react";
import axios from "axios";
import { loginUser } from "../api";
import Header from "./Header";
import FadeTransition from "./FadeTransition";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const Login = () => {
  const [mode, setMode] = useState("user"); // 'user' or 'admin'
  const navigate = useNavigate();
  const fadeRef = useRef(null);

  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [userErrors, setUserErrors] = useState({});
  const [adminError, setAdminError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleUserChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const validateUser = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if (!emailRegex.test(userForm.email.trim()))
      newErrors.email = "Invalid email format";
    if (!userForm.password) newErrors.password = "Password is required";
    setUserErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    if (!validateUser()) return;

    setLoading(true);
    try {
      const res = await loginUser(userForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ email: userForm.email }));
      localStorage.setItem("userEmail", userForm.email.trim().toLowerCase());

      if (fadeRef.current) {
        fadeRef.current("/user-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, {
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
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
      console.error("Admin login error:", err);
      setAdminError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <FadeTransition targetPath="/" externalTriggerRef={fadeRef}>
      <div style={styles.wrapper}>
        <div style={styles.overlay}>
          <Header />
          <div style={styles.centerWrapper}>
            <div style={styles.container}>
              <div style={styles.titleGroup}>
                <div style={styles.title}>Hydroleap</div>
                <div style={{ ...styles.title, marginTop: "0.2rem" }}>
                  {mode === "user" ? "User Login" : "Admin Login"}
                </div>
              </div>

              <div style={styles.toggleSwitch}>
                <button
                  onClick={() => setMode("user")}
                  style={{
                    ...styles.toggleButton,
                    backgroundColor: mode === "user" ? "#21c6bc" : "#e0fcfa",
                    color: mode === "user" ? "#fff" : "#185754",
                  }}
                >
                  User
                </button>
                <button
                  onClick={() => setMode("admin")}
                  style={{
                    ...styles.toggleButton,
                    backgroundColor: mode === "admin" ? "#21c6bc" : "#e0fcfa",
                    color: mode === "admin" ? "#fff" : "#185754",
                  }}
                >
                  Admin
                </button>
              </div>

              {mode === "user" ? (
                <form onSubmit={handleUserLogin} style={styles.form}>
                  <input
                    name="email"
                    placeholder="Enter User Email"
                    value={userForm.email}
                    onChange={handleUserChange}
                    style={styles.input}
                  />
                  {userErrors.email && (
                    <div style={styles.error}>{userErrors.email}</div>
                  )}

                  <div style={styles.passwordWrapper}>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={userForm.password}
                      onChange={handleUserChange}
                      style={{ ...styles.input, paddingRight: "2.5rem" }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </span>
                  </div>
                  {userErrors.password && (
                    <div style={styles.error}>{userErrors.password}</div>
                  )}

                  <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Logging in..." : "Login as User"}
                  </button>
                </form>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Enter Admin Email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    style={styles.input}
                  />
                  <div style={styles.passwordWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      style={{ ...styles.input, paddingRight: "2.5rem" }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </span>
                  </div>
                  {adminError && <div style={styles.error}>{adminError}</div>}
                  <button onClick={handleAdminLogin} style={styles.button}>
                    Login as Admin
                  </button>
                </>
              )}

              <button
                onClick={() => navigate("/choose")}
                style={{ ...styles.button, marginTop: "1rem" }}
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
    border: "1.5px solid #e0fcfa",
  },
  titleGroup: {
    marginBottom: "1.2rem",
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
    borderRadius: "8px",
    border: "1.5px solid #b7f4ee",
    backgroundColor: "#f7fefe",
    color: "#185754",
    marginBottom: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "1rem",
  },
eyeIcon: {
  position: "absolute",
  top: "40%",
  right: "0.75rem",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#185754",
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
  },
  error: {
    fontSize: "0.85rem",
    color: "#ff6f7d",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
  toggleSwitch: {
  display: "flex",
  justifyContent: "space-between",  // ensures equal spacing
  width: "100%",                    // full width of parent
  marginBottom: "1rem",
  gap: "0.5rem",
},

toggleButton: {
  flex: 1,
  padding: "0.6rem",
  textAlign: "center",
  borderRadius: "8px",
  border: "1px solid #b7f4ee",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "1rem",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap",             // avoid multiline issues
  boxSizing: "border-box",          // for consistent sizing
},

};

export default Login;
