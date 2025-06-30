// src/components/UserProjectsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import seaVideo from "../assets/sea_7.mp4";
import Header from "./Header";

const UserProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (!token || !email) {
      alert("Please log in.");
      navigate("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/projects/user/${email}`);
        if (!response.ok) throw new Error("Failed to fetch assigned projects");
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error(err);
        setError("Could not load assigned projects.");
      }
    };

    fetchProjects();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <video autoPlay muted loop style={styles.videoBackground}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      <div style={styles.content}>
        <Header />
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
                onClick={() => navigate(`/project/${projectId}`)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <h3>{projectId}</h3>
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
    position: "relative",
    minHeight: "100vh",
    fontFamily: "'Times New Roman', serif",
    overflow: "hidden",
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
    padding: "3rem 2rem",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    textShadow: "0 2px 5px rgba(0,0,0,0.5)",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    marginTop: "1.5rem",
  },
  card: {
    background: "rgba(0, 0, 0, 0.25)",
    borderRadius: "18px",
    padding: "2rem",
    width: "260px",
    backdropFilter: "blur(6px)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  noProjects: {
    color: "#ddd",
    fontStyle: "italic",
  },
};

export default UserProjectsPage;
