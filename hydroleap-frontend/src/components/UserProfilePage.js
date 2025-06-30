import React, { useEffect, useState } from "react";
import axios from "axios";
import seaVideo from "../assets/sea_7.mp4";
import Header from "./Header"; // ✅ Ensures logo is included

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
      <p style={{ color: "#fff", padding: "2rem" }}>Loading profile...</p>
    );

  return (
    <div style={styles.container}>
      <video autoPlay muted loop style={styles.videoBackground}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      <Header /> {/* ✅ Add logo/header to top without disturbing layout */}

      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={styles.title}>My Profile</h2>

          <div style={styles.formGroup}>
            <label>Name:</label>
            <p style={styles.value}>{user.name}</p>
          </div>

          <div style={styles.formGroup}>
            <label>Email:</label>
            <p style={styles.value}>{user.email}</p>
          </div>

          <div style={styles.formGroup}>
            <label>Phone:</label>
            <p style={styles.value}>{user.phone}</p>
          </div>

          <div style={styles.formGroup}>
            <label>Gender:</label>
            <p style={styles.value}>{user.gender}</p>
          </div>

          <div style={styles.formGroup}>
            <label>Date of Birth:</label>
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
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "'Times New Roman', serif",
  },
  videoBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    objectFit: "cover",
    zIndex: -1,
  },
  overlay: {
    position: "absolute", // ensures card sits over everything
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    zIndex: 1,
  },
  card: {
    background: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "500px",
    color: "#fff",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "bold",
    textShadow: "0 2px 6px rgba(0,0,0,0.6)",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  value: {
    marginTop: "0.3rem",
  },
};

export default UserProfilePage;
