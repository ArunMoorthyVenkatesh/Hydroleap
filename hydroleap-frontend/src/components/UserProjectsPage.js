import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const ACCENT = "#21c6bc";

const UserProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    if (!token || !email) {
      alert("Please log in.");
      navigate("/login");
      return;
    }

    setUserInfo({email });

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/projects/project-access/user/${email}`
        );
        if (!response.ok) throw new Error("Failed to fetch assigned projects");
        const data = await response.json();
        setProjects(Array.isArray(data) ? data.map((d) => d.projectId) : []);
      } catch (err) {
        console.error(err);
        setError("Could not load assigned projects.");
      }
    };

    fetchProjects();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <Header />

      {/* Top-Right Name and Email */}
      <div style={styles.userInfo}>
        <p style={styles.name}>{userInfo.name}</p>
        <p style={styles.email}>{userInfo.email}</p>
      </div>

      <div style={styles.content}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>

        <h2 style={styles.title}>My Assigned Projects</h2>

        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.grid}>
          {projects.length === 0 ? (
            <p style={styles.noProjects}>No projects assigned yet.</p>
          ) : (
            projects.map((projectId, index) => (
              <div
                key={index}
                style={styles.card}
                onClick={() => navigate(`/iot/${projectId}`)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <h3 style={styles.cardTitle}>{projectId}</h3>
              </div>
            ))
          )}
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
    overflow: "hidden",
    position: "relative",
  },
  userInfo: {
    position: "absolute",
    top: "1rem",
    right: "1.5rem",
    zIndex: 1000,
    color: "#11786e",
    fontSize: "0.92rem",
    textAlign: "right",
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
    padding: "3rem 2rem",
    color: "#187d69",
    textAlign: "center",
    minHeight: "100vh",
  },
  backButton: {
    background: "none",
    border: "none",
    color: ACCENT,
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
    marginBottom: "1rem",
    marginLeft: "1rem",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    color: ACCENT,
    letterSpacing: ".01em",
    textShadow: "0 2px 10px #b9f5ef",
  },
  error: {
    color: "#ff5757",
    fontWeight: "bold",
    marginBottom: "1.2rem",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    marginTop: "1.5rem",
  },
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "18px",
    border: `1.5px solid ${ACCENT}22`,
    padding: "2rem",
    width: "260px",
    boxShadow: "0 4px 32px #bbf2eb",
    color: "#157f7c",
    backdropFilter: "blur(7px) saturate(170%)",
    cursor: "pointer",
    transition: "transform 0.3s cubic-bezier(.41,1.2,.65,1), box-shadow 0.3s",
    fontWeight: "600",
  },
  cardTitle: {
    color: ACCENT,
    fontWeight: "700",
    letterSpacing: ".02em",
    fontSize: "1.17rem",
  },
  noProjects: {
    color: "#8ecdc9",
    fontStyle: "italic",
    padding: "1.8rem",
  },
};

export default UserProjectsPage;
