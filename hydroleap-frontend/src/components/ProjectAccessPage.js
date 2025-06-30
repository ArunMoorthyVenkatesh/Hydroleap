import React, { useEffect, useState } from "react";
import Header222 from "./Header222"; // ✅ Replaced Header with Header222
import seaVideo from "../assets/sea_7.mp4";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectAccessPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Access denied. Please login as admin.");
      navigate("/admin-login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/project-list/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
        setError("Failed to load projects");
      }
    };

    fetchProjects();
  }, [navigate]);

  const fetchAccessList = async (projectId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/projects/project-access/list/${projectId}`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch access list failed:", text);
        setAccessList([]);
        return;
      }

      await res.json().then(setAccessList);
    } catch (err) {
      console.error("❌ Error fetching access list:", err);
      setAccessList([]);
    }
  };

  const handleGrantAccess = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !selectedProject) {
      setMessage("⚠️ Please enter an email and select a project");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/projects/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, projectId: selectedProject }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage(`❌ ${text}`);
        return;
      }

      await res.json();
      setMessage(`✅ Access granted to ${trimmedEmail}`);
      setEmail("");
      fetchAccessList(selectedProject);
    } catch (error) {
      console.error("Grant access error:", error);
      setMessage("❌ Something went wrong while granting access");
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchAccessList(selectedProject);
    }
  }, [selectedProject]);

  const filteredProjects = projects.filter((p) =>
    p.projectId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <video autoPlay muted loop style={styles.videoBackground}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      <div style={styles.content}>
        <Header222 /> {/* ✅ Header222 inserted */}
        <h2 style={styles.title}>Assign Project Access</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.verticalList}>
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              style={{
                ...styles.card,
                border:
                  selectedProject === project.projectId
                    ? "2px solid #4a90e2"
                    : "1px solid rgba(255, 255, 255, 0.3)",
              }}
              onClick={() =>
                setSelectedProject((prev) =>
                  prev === project.projectId ? null : project.projectId
                )
              }
            >
              <h3>{project.projectId}</h3>
              <p><strong>Device:</strong> {project.deviceId || "N/A"}</p>
              <p><strong>Running:</strong> {project["system running"] ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div style={styles.accessPanel}>
            <h3>Grant Access to: {selectedProject}</h3>
            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleGrantAccess} style={styles.button}>
              Grant Access
            </button>
            {message && <p style={styles.message}>{message}</p>}

            <div style={styles.accessList}>
              <h4>Users with Access:</h4>
              {accessList.length === 0 ? (
                <p style={styles.noAccess}>No users have access yet.</p>
              ) : (
                accessList.map((entry, index) => (
                  <div key={entry.email || index} style={styles.accessItem}>
                    <span>{entry.email}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    overflow: "auto",
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
    padding: "3rem 2rem",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    textShadow: "0 2px 5px rgba(0,0,0,0.5)",
  },
  searchInput: {
    width: "90%",
    maxWidth: "500px",
    padding: "1rem",
    background: "rgba(0, 0, 0, 0.25)",
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(6px)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "2rem",
    outline: "none",
    textAlign: "center",
  },
  verticalList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  card: {
    background: "rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(6px)",
    borderRadius: "18px",
    padding: "2rem",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
  accessPanel: {
    marginTop: "2rem",
    background: "rgba(0,0,0,0.4)",
    padding: "1.5rem",
    borderRadius: "10px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "5px",
    marginBottom: "1rem",
    border: "none",
    fontSize: "1rem",
  },
  button: {
    padding: "0.6rem 1.5rem",
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    fontStyle: "italic",
  },
  accessList: {
    marginTop: "1.5rem",
    textAlign: "left",
  },
  accessItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    marginTop: "0.5rem",
  },
  noAccess: {
    marginTop: "1rem",
    color: "#ccc",
  },
};

export default ProjectAccessPage;
