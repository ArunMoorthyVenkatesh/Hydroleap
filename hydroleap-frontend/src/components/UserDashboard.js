// src/components/UserDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const ACCENT = "#21c6bc";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    if (!token) {
      alert("Please log in.");
      navigate("/login");
    } else {
      setUserInfo({ email: email || "No Email" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.userInfo}>
        <p style={styles.name}>{userInfo.name}</p>
        <p style={styles.email}>{userInfo.email}</p>
      </div>

      <div style={styles.content}>
        <Header />
        <h2 style={styles.title}>User Dashboard</h2>
        <div style={styles.grid}>
          <div
            style={styles.card}
            onClick={() => navigate("/profile")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={styles.cardTitle}>Profile</h3>
            <p style={styles.cardText}>View and manage your user profile</p>
          </div>
          <div
            style={styles.card}
            onClick={() => navigate("/user/projects")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={styles.cardTitle}>Projects</h3>
            <p style={styles.cardText}>See your assigned or created projects</p>
          </div>
        </div>
        <div style={styles.logoutWrapper}>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(0.93)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e6fcfa 0%, #fafdff 100%)",
    fontFamily: "'Times New Roman', serif",
  },
  userInfo: {
    position: "absolute",
    top: "1rem",
    right: "1.5rem",
    zIndex: 1000,
    color: "#11786e",
    fontSize: "0.92rem",
    textAlign: "left",
  },
  name: {
    fontWeight: "700",
    marginBottom: "0.2rem",
    fontSize: "1.05rem",
  },
  email: {
    fontWeight: "500",
    fontSize: "0.95rem",
  },
  content: {
    position: "relative",
    padding: "3rem 2rem",
    color: "#11544c",
    textAlign: "center",
    zIndex: 1,
  },
  title: {
    fontSize: "2.7rem",
    marginBottom: "2.2rem",
    fontWeight: "700",
    color: ACCENT,
    letterSpacing: ".01em",
    textShadow: "0 2px 18px #c5f5f1, 0 2px 5px rgba(40,180,170,0.18)",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  card: {
    background: "rgba(255, 255, 255, 0.94)",
    border: `1.5px solid ${ACCENT}33`,
    borderRadius: "18px",
    padding: "2rem 1.3rem",
    width: "260px",
    cursor: "pointer",
    backdropFilter: "blur(9px) saturate(180%)",
    color: "#11786e",
    boxShadow: "0 4px 30px #bbf2eb",
    transition: "transform 0.3s, box-shadow 0.3s, background 0.3s, filter 0.2s",
    fontWeight: "600",
    fontSize: "1.08rem",
    marginBottom: "1.2rem",
  },
  cardTitle: {
    margin: 0,
    marginBottom: ".6rem",
    fontSize: "1.22rem",
    color: ACCENT,
    fontWeight: "700",
    letterSpacing: ".01em",
  },
  cardText: {
    margin: 0,
    color: "#177e78",
    fontWeight: "500",
    fontSize: "1rem",
  },
  logoutWrapper: {
    marginTop: "2.5rem",
    display: "flex",
    justifyContent: "center",
  },
  logoutButton: {
    padding: "0.8rem 2.2rem",
    background: `linear-gradient(90deg, ${ACCENT} 0%, #79ece4 100%)`,
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 2px 16px #b5edea",
    transition: "all 0.26s",
    letterSpacing: ".01em",
    outline: "none",
  },
};

export default UserDashboard;
