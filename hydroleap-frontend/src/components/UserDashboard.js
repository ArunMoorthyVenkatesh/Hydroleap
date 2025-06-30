// src/components/UserDashboard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import seaVideo from "../assets/sea_7.mp4";

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in.");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail"); // 🧹 Optional: clean up stored email
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <video autoPlay muted loop style={styles.videoBackground}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      <div style={styles.content}>
        <Header />
        <h2 style={styles.title}>User Dashboard</h2>

        <div style={styles.grid}>
          <div
            style={styles.card}
            onClick={() => navigate("/profile")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3>Profile</h3>
            <p>View and manage your user profile</p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate("/user/projects")} // ✅ Updated path
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3>Projects</h3>
            <p>See your assigned or created projects</p>
          </div>
        </div>

        <div style={styles.logoutWrapper}>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
    height: "100vh",
    overflow: "hidden",
    fontFamily: "'Times New Roman', serif",
  },
  videoBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    zIndex: -1,
  },
  content: {
    position: "relative",
    padding: "3rem 2rem",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "2.5rem",
    fontWeight: "700",
    textShadow: "0 2px 5px rgba(0,0,0,0.5)",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
  card: {
    background: "rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "18px",
    padding: "2rem",
    width: "260px",
    cursor: "pointer",
    backdropFilter: "blur(6px)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  logoutWrapper: {
    marginTop: "2.5rem",
    display: "flex",
    justifyContent: "center",
  },
  logoutButton: {
    padding: "0.8rem 2.2rem",
    backgroundColor: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease",
  },
};

export default UserDashboard;
