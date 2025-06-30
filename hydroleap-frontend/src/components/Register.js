import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import seaVideo from "../assets/sea_4.mp4";

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
  const navigate = useNavigate();

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
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const genderOptions = ["Male", "Female", "Other"];

    const newErrors = {};

    if (!nameRegex.test(form.firstName)) newErrors.firstName = "First name should be 1–50 alphabetical characters.";
    if (form.middleName && !nameRegex.test(form.middleName)) newErrors.middleName = "Middle name must be alphabetical.";
    if (!nameRegex.test(form.lastName)) newErrors.lastName = "Last name should be 1–50 alphabetical characters.";
    if (!form.dob || !isValidDOB(form.dob)) newErrors.dob = "Must be 18 years or older.";
    if (!phoneRegex.test(form.phone)) newErrors.phone = "Invalid SG phone number. Example: +65 91234567";
    if (!genderOptions.includes(form.gender)) newErrors.gender = "Please select a valid gender.";
    if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format.";
    if (!passwordRegex.test(form.password)) newErrors.password = "Password must be 8+ characters with uppercase, lowercase, number & special character.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailExists = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/check/check-email/${email}`);
      return res.data.exists;
    } catch (err) {
      console.error("Email check failed", err);
      return false;
    }
  };

  const sendOtp = async () => {
    if (!validate()) {
      alert("Please correct the highlighted errors before proceeding.");
      return;
    }

    const email = form.email.trim().toLowerCase();
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setErrors((prev) => ({
        ...prev,
        email: role === "admin"
          ? "email already exists or is pending approval."
          : "email already exists or is pending approval.",
      }));
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/otp/send", {
        email,
      });
      alert("OTP sent to your email.");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  const verifyAndRegister = async () => {
    if (!validate()) {
      alert("Please correct the highlighted errors before proceeding.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/otp/verify", {
        email: form.email.trim().toLowerCase(),
        otp: form.otp.toString().trim(),
      });

      const res = await axios.post("http://localhost:5001/api/auth/request-signup", {
        ...form,
        email: form.email.trim().toLowerCase(),
        role,
      });

      alert(res.data.message || "Registered successfully.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification or registration failed.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <video autoPlay loop muted playsInline style={styles.video}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      <div style={styles.overlay}>
        <Header />
        <div style={styles.centerWrapper}>
          <div style={styles.container}>
            <h2 style={styles.title}>Register</h2>

            <div style={styles.roleSwitch}>
              <button
                onClick={() => setRole("user")}
                style={{ ...styles.roleButton, backgroundColor: role === "user" ? "#ffffff44" : "transparent" }}
              >
                Register as User
              </button>
              <button
                onClick={() => setRole("admin")}
                style={{ ...styles.roleButton, backgroundColor: role === "admin" ? "#ffffff44" : "transparent" }}
              >
                Register as Admin
              </button>
            </div>

            <div style={styles.form}>
              <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} style={styles.input} />
              {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}

              <input name="middleName" placeholder="Middle Name (Optional)" value={form.middleName} onChange={handleChange} style={styles.input} />
              {errors.middleName && <span style={styles.error}>{errors.middleName}</span>}

              <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} style={styles.input} />
              {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}

              <input name="dob" type="date" max="2007-06-02" value={form.dob} onChange={handleChange} style={styles.input} />
              {errors.dob && <span style={styles.error}>{errors.dob}</span>}

              <input name="phone" placeholder="Phone Number (e.g., +65 91234567)" value={form.phone} onChange={handleChange} style={styles.input} />
              {errors.phone && <span style={styles.error}>{errors.phone}</span>}

              <div style={styles.genderGroup}>
                {["Male", "Female", "Other"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, gender: option });
                      setErrors({ ...errors, gender: "" });
                    }}
                    style={{
                      ...styles.genderButton,
                      backgroundColor: form.gender === option ? "#ffffff44" : "transparent",
                      borderColor: form.gender === option ? "#fff" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {errors.gender && <span style={styles.error}>{errors.gender}</span>}

              <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} />
              {errors.email && <span style={styles.error}>{errors.email}</span>}

              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={styles.input} />
              {errors.password && <span style={styles.error}>{errors.password}</span>}

              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} style={styles.input} />
              {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}

              {!otpSent ? (
                <button onClick={sendOtp} style={styles.button}>Send OTP</button>
              ) : (
                <>
                  <input name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} style={styles.input} />
                  <button onClick={verifyAndRegister} style={styles.button}>
                    Register as {role === "admin" ? "Admin" : "User"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { position: "relative", height: "100vh", overflow: "hidden", fontFamily: "Times New Roman, serif" },
  video: { position: "absolute", width: "100%", height: "100%", objectFit: "cover", top: 0, left: 0, zIndex: 0 },
  overlay: { position: "relative", zIndex: 1, height: "100%", width: "100%", display: "flex", flexDirection: "column", color: "#fff" },
  centerWrapper: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
  container: {
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "15px",
    padding: "1.5rem",
    width: "300px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem", fontFamily: "Georgia, serif" },
  roleSwitch: { display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" },
  roleButton: {
    flex: 1,
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.4)",
    color: "#fff",
    fontSize: "0.95rem",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  form: { display: "flex", flexDirection: "column", width: "100%" },
  input: {
    padding: "0.6rem 0.8rem",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    marginBottom: "0.75rem",
    outline: "none",
    backdropFilter: "blur(4px)",
  },
  button: {
    padding: "0.7rem 1rem",
    backgroundColor: "#ffffff33",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s",
  },
  genderGroup: { display: "flex", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" },
  genderButton: {
    flex: 1,
    padding: "0.5rem",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    fontFamily: "Times New Roman, serif",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  error: {
    color: "#ffaaaa",
    fontSize: "0.8rem",
    marginTop: "-0.6rem",
    marginBottom: "0.5rem",
    paddingLeft: "0.2rem",
  },
};

export default Register;
