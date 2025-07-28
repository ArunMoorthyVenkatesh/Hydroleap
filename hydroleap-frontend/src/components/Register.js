import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Header from "./Header";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";
const ACCENT = "#21c6bc";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRef = useRef(null);
  const navigate = useNavigate();

  // --- DEBUG LOG FOR FORM STATE ---
  console.log("Current form state:", form);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const isValidDOB = (dobStr) => {
    const dob = new Date(dobStr);
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return dob <= today;
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z]{1,50}$/;
    const phoneRegex = /^\+65\s?[89]\d{7}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const genderOptions = ["Male", "Female", "Other"];
    const newErrors = {};

    if (!nameRegex.test(form.firstName)) newErrors.firstName = "First name must be 1–50 letters.";
    if (form.middleName && !nameRegex.test(form.middleName)) newErrors.middleName = "Middle name must be letters only.";
    if (!nameRegex.test(form.lastName)) newErrors.lastName = "Last name must be 1–50 letters.";



    if (!form.dob || !isValidDOB(form.dob)) newErrors.dob = "Must be at least 18 years old.";
    if (!phoneRegex.test(form.phone)) newErrors.phone = "Invalid SG phone. Format: +65 91234567";
    if (!genderOptions.includes(form.gender)) newErrors.gender = "Select a valid gender.";
    if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format.";
    if (!passwordRegex.test(form.password)) newErrors.password = "Password must be 8+ chars with A-Z, a-z, 0-9, special char.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailExists = async (email) => {
    try {
      const res = await axios.get(`${API_BASE}/check/check-email/${email}`);
      return res.data.exists;
    } catch {
      return false;
    }
  };

  const sendOtp = async () => {
    if (!validate()) {
      alert("Fix validation errors first.");
      return;
    }

    const email = form.email.trim().toLowerCase();
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setErrors((prev) => ({ ...prev, email: "Email already exists or is pending." }));
      return;
    }

    try {
      await axios.post(`${API_BASE}/otp/send`, { email });
      alert("OTP sent!");
      setOtpSent(true);
      setTimeout(() => {
        otpRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  const verifyAndRegister = async () => {
    if (!validate()) {
      alert("Fix validation errors first.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/otp/verify`, {
        email: form.email.trim().toLowerCase(),
        otp: form.otp.toString().trim(),
      });

      // --- DEBUG LOG FOR PAYLOAD BEFORE REGISTER ---
      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(),
        role,
      };
      console.log("Submitting registration payload:", payload);

      const res = await axios.post(`${API_BASE}/auth/request-signup`, payload);

      alert(res.data.message || "Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.overlay}>
        <Header />
        <div style={styles.centerWrapper}>
          <div style={styles.container}>
            <button onClick={() => navigate("/choose")} style={styles.backButton}>
              ← Back
            </button>
            <h2 style={styles.title}>Register</h2>
            <div style={styles.roleSwitch}>
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    ...styles.roleButton,
                    background: role === r ? "#21c6bc22" : "#f3fffe",
                    color: role === r ? "#21c6bc" : "#187d69",
                    fontWeight: role === r ? "700" : "600",
                  }}
                >
                  {r === "user" ? "User" : "Admin"}
                </button>
              ))}
            </div>
            <div style={styles.scrollWrapper}>
              <form style={styles.form}>
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} style={styles.input} />
                {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}

                <input name="middleName" placeholder="Middle Name (Optional)" value={form.middleName} onChange={handleChange} style={styles.input} />
                {errors.middleName && <span style={styles.error}>{errors.middleName}</span>}

                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} style={styles.input} />
                {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}


                <input name="dob" type="date" value={form.dob} onChange={handleChange} style={styles.input} />
                {errors.dob && <span style={styles.error}>{errors.dob}</span>}

                <input name="phone" placeholder="Phone (e.g. +65 91234567)" value={form.phone} onChange={handleChange} style={styles.input} />
                {errors.phone && <span style={styles.error}>{errors.phone}</span>}

                <div style={styles.genderGroup}>
                  {["Male", "Female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, gender: g });
                        setErrors({ ...errors, gender: "" });
                      }}
                      style={{
                        ...styles.genderButton,
                        background: form.gender === g ? ACCENT : "#edfcfb",
                        color: form.gender === g ? "#fff" : ACCENT,
                        fontWeight: form.gender === g ? 700 : 600,
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {errors.gender && <span style={styles.error}>{errors.gender}</span>}

                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} />
                {errors.email && <span style={styles.error}>{errors.email}</span>}

                <div style={{ position: "relative" }}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                  {errors.password && <span style={styles.error}>{errors.password}</span>}
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                  {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
                </div>

                {!otpSent ? (
                  <button type="button" onClick={sendOtp} style={styles.button}>Send OTP</button>
                ) : (
                  <>
                    <input
                      ref={otpRef}
                      name="otp"
                      placeholder="Enter OTP"
                      value={form.otp}
                      onChange={handleChange}
                      style={styles.input}
                    />
                    <button type="button" onClick={verifyAndRegister} style={styles.button}>
                      Register as {role === "admin" ? "Admin" : "User"}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    fontFamily: "Arial",
    background: "#f0fefd",
    minHeight: "100vh",
    padding: "1rem",
    boxSizing: "border-box",
  },
  overlay: { display: "flex", flexDirection: "column", alignItems: "center" },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1rem",
    color: ACCENT,
  },
  roleSwitch: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.5rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  roleButton: {
    flex: 1,
    padding: "0.6rem",
    border: "1px solid #b7f4ee",
    borderRadius: "10px",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  scrollWrapper: {
    maxHeight: "65vh",
    overflowY: "auto",
    paddingRight: "6px",
    WebkitOverflowScrolling: "touch",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1.5px solid #b7f4ee",
    backgroundColor: "#f7fefe",
    color: "#185754",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.2s ease",
  },
  error: {
    fontSize: "0.75rem",
    color: "#ff5c5c",
    marginTop: "-0.5rem",
    paddingLeft: "2px",
  },
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: "12px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#185754",
  },
  button: {
    padding: "0.75rem",
    background: ACCENT,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
  },
  genderGroup: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  genderButton: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "20px",
    border: "1.5px solid #b9efed",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  centerWrapper: {
    width: "100%",
    maxWidth: "480px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 100px)",
    paddingTop: "2rem",
    paddingBottom: "2rem",
    boxSizing: "border-box",
  },
  container: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "480px",
    boxSizing: "border-box",
  },
  backButton: {
    background: "none",
    border: "none",
    color: ACCENT,
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    marginBottom: "0.5rem",
    textAlign: "left",
    padding: "0",
  },
};

export default Register;
