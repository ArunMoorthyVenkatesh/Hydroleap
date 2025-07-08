import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header"; // ✅ Ensures logo is included

const ACCENT = "#21c6bc";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        alert("Could not load profile");
      }
    };

    fetchProfile();
  }, [token]);

  if (!user)
    return (
      <p style={{ color: ACCENT, padding: "2rem" }}>Loading profile...</p>
    );

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={styles.title}>My Profile</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <p style={styles.value}>{user.name}</p>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <p style={styles.value}>{user.email}</p>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone:</label>
            <p style={styles.value}>{user.phone}</p>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Gender:</label>
            <p style={styles.value}>{user.gender}</p>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Birth:</label>
            <p style={styles.value}>
              {new Date(user.dob).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e6fcfa 0%, #fafdff 100%)",
    fontFamily: "'Times New Roman', serif",
  },
  overlay: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    border: `1.5px solid ${ACCENT}33`,
    borderRadius: "18px",
    padding: "2.3rem 2rem",
    width: "100%",
    maxWidth: "370px",
    color: "#177e78",
    backdropFilter: "blur(9px) saturate(180%)",
    boxShadow: "0 4px 36px #bbf2eb",
    marginTop: "1.2rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.6rem",
    textAlign: "center",
    fontWeight: "700",
    color: ACCENT,
    letterSpacing: ".01em",
    textShadow: "0 2px 12px #c5f5f1, 0 2px 6px #17a6a266",
  },
  formGroup: {
    marginBottom: "1.1rem",
  },
  label: {
    color: "#187d69",
    fontWeight: 600,
    letterSpacing: ".01em",
  },
  value: {
    margin: "0.22rem 0 0 0",
    fontSize: "1.09rem",
    color: "#137f7d",
    wordBreak: "break-word",
    paddingLeft: ".2rem",
  },
};

export default UserProfilePage;
