import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectAccessPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [granting, setGranting] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAccessList, setLoadingAccessList] = useState(false);

  // Fetch projects
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setMessage("Please log in as admin.");
      setProjects([]);
      setLoadingProjects(false);
      return;
    }
    setLoadingProjects(true);
    axios
      .get("http://localhost:5001/api/project-list/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjects(res.data);
        setLoadingProjects(false);
      })
      .catch(() => {
        setMessage("❌ Failed to load projects.");
        setProjects([]);
        setLoadingProjects(false);
      });
  }, []);

  // Fetch access list for selected project
  useEffect(() => {
    if (!selectedProject) {
      setAccessList([]);
      return;
    }
    setLoadingAccessList(true);
    axios
      .get(
        `http://localhost:5001/api/projects/project-access/list/${encodeURIComponent(selectedProject)}`
      )
      .then((res) => {
        setAccessList(res.data);
        setLoadingAccessList(false);
      })
      .catch(() => {
        setAccessList([]);
        setLoadingAccessList(false);
      });
  }, [selectedProject]);

  // Grant access (use correct endpoint)
  const handleGrantAccess = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !selectedProject) {
      setMessage("⚠️ Please enter an email and select a project");
      return;
    }
    setGranting(true);
    setMessage("");
    try {
      await axios.post("http://localhost:5001/api/projects/project-access/assign", {
        email: trimmedEmail,
        projectId: selectedProject,
      });
      setMessage(`✅ Access granted to ${trimmedEmail}`);
      setEmail("");
      // Refresh access list
      const accessRes = await axios.get(
        `http://localhost:5001/api/projects/project-access/list/${encodeURIComponent(selectedProject)}`
      );
      setAccessList(accessRes.data);
    } catch (error) {
      const apiMsg = error.response?.data?.message || error.message;
      setMessage(`❌ ${apiMsg}`);
    }
    setGranting(false);
  };

  // Project filter
  const filteredProjects = projects.filter((p) =>
    p.projectId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.mainPanel}>
      {/* LEFT: Projects */}
      <div style={styles.leftPanel}>
        <input
          type="text"
          placeholder="🔍 Search projects…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.projectList}>
          {loadingProjects ? (
            <p style={styles.info}>Loading projects…</p>
          ) : filteredProjects.length === 0 ? (
            <p style={styles.info}>No projects found.</p>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project._id}
                style={{
                  ...styles.card,
                  border:
                    selectedProject === project.projectId
                      ? "3px solid #23c1b5"
                      : "2px solid #e0f3ef",
                  background:
                    selectedProject === project.projectId
                      ? "rgba(245,255,255,0.97)"
                      : "rgba(230,248,246,0.85)",
                }}
                onClick={() =>
                  setSelectedProject(
                    selectedProject === project.projectId
                      ? null
                      : project.projectId
                  )
                }
                tabIndex={0}
              >
                <div>
                  <h3 style={styles.cardTitle}>{project.projectId}</h3>
                  <div style={styles.deviceRow}>
                    <span style={styles.deviceLabel}>Device:</span>{" "}
                    <span style={styles.deviceVal}>
                      {project.deviceId || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span style={styles.statusLabel}>Status:</span>{" "}
                    {project["system running"] ? (
                      <span style={styles.statusRunning}>Running</span>
                    ) : (
                      <span style={styles.statusStopped}>Stopped</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* RIGHT: Access control */}
      <div style={styles.accessPanel}>
        {selectedProject ? (
          <>
            <h2 style={styles.panelTitle}>
              <span style={styles.panelProjectId}>{selectedProject}</span>
            </h2>
            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.emailInput}
              autoFocus
            />
            <button
              style={styles.grantBtn}
              onClick={handleGrantAccess}
              disabled={granting || !email.trim()}
            >
              {granting ? "Granting..." : "Grant Access"}
            </button>
            {message && <div style={styles.message}>{message}</div>}

            <div style={styles.accessListBox}>
              <div style={styles.usersLabel}>Users with Access:</div>
              {loadingAccessList ? (
                <span style={styles.noAccess}>Loading users…</span>
              ) : accessList.length === 0 ? (
                <span style={styles.noAccess}>No users have access yet.</span>
              ) : (
                accessList.map((entry, i) => (
                  <div key={entry.email || i} style={styles.accessRow}>
                    <span>{entry.email}</span>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div style={styles.selectMsg}>Select a project to manage access</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  mainPanel: {
    display: "flex",
    gap: "3.7rem",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: "0 auto",
    width: "100%",
  },
  leftPanel: {
    minWidth: "415px",
    maxWidth: "460px",
    width: "30vw",
    padding: "2.7rem 2.1rem",
    background: "rgba(220,250,249,0.78)",
    borderRadius: "28px",
    boxShadow: "0 8px 38px #6ee0ec1a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  searchInput: {
    width: "100%",
    padding: "1.45rem",
    fontSize: "1.3rem",
    borderRadius: "18px",
    border: "2.7px solid #def6f2",
    margin: "0 0 2.3rem 0",
    background: "linear-gradient(92deg, #fff 0%, #f2f9f7 80%)",
    color: "#1d6161",
    fontWeight: 700,
    textAlign: "center",
    outline: "none",
    boxShadow: "0 3px 15px #21bab31a",
    letterSpacing: "0.5px",
  },
  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.8rem",
    width: "100%",
  },
  card: {
    borderRadius: "19px",
    background: "#eaf9f7",
    padding: "1.7rem 2rem 1.2rem 2rem",
    cursor: "pointer",
    boxShadow: "0 2px 24px #34a9c812",
    transition: "border 0.17s, background 0.15s, box-shadow 0.18s",
    outline: "none",
    minHeight: "100px",
  },
  cardTitle: {
    color: "#06928c",
    fontWeight: 900,
    fontSize: "1.25rem",
    margin: "0 0 0.7rem 0",
    letterSpacing: "-0.5px",
  },
  deviceRow: {
    fontSize: "1.08rem",
    margin: "0.2rem 0 0.7rem 0",
  },
  deviceLabel: {
    color: "#9126ad",
    fontWeight: 700,
  },
  deviceVal: {
    color: "#333",
    fontWeight: 700,
    marginLeft: "0.3em",
  },
  statusLabel: {
    fontWeight: 700,
    color: "#888",
    fontSize: "1.08rem",
  },
  statusRunning: {
    color: "#169b37",
    fontWeight: 900,
    marginLeft: "0.3em",
    fontSize: "1.13rem",
  },
  statusStopped: {
    color: "#e43b39",
    fontWeight: 900,
    marginLeft: "0.3em",
    fontSize: "1.13rem",
  },
  accessPanel: {
    background: "rgba(255,255,255,0.99)",
    borderRadius: "28px",
    boxShadow: "0 8px 38px #13b2c122",
    padding: "3.3rem 2.8rem 2.5rem 2.8rem",
    minWidth: "440px",
    maxWidth: "540px",
    flex: 1,
    minHeight: "480px",
    marginLeft: "0.3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  panelTitle: {
    color: "#13bab4",
    fontSize: "2rem",
    fontWeight: 800,
    marginBottom: "1.7rem",
    letterSpacing: "-0.5px",
    textAlign: "center",
  },
  panelProjectId: {
    color: "#0a938d",
    fontWeight: 900,
  },
  emailInput: {
    width: "100%",
    padding: "1.1rem",
    borderRadius: "13px",
    border: "2.5px solid #d6f7f4",
    fontSize: "1.14rem",
    margin: "1.3rem 0 1.2rem 0",
    background: "#edfff9",
    color: "#087a72",
    fontWeight: 600,
    outline: "none",
  },
  grantBtn: {
    background: "#19c6b5",
    color: "#fff",
    padding: "1.08rem 2.1rem",
    fontWeight: 800,
    fontSize: "1.16rem",
    borderRadius: "13px",
    border: "none",
    cursor: "pointer",
    marginBottom: "1.8rem",
    marginTop: "0",
    transition: "background 0.15s",
  },
  message: {
    marginTop: "0.8rem",
    fontStyle: "italic",
    color: "#1b827d",
    fontWeight: 800,
    fontSize: "1.1rem",
    minHeight: "24px",
  },
  accessListBox: {
    marginTop: "1.7rem",
    background: "#f7fcfd",
    borderRadius: "15px",
    padding: "1.3rem 1rem 1.3rem 1.3rem",
    boxShadow: "0 2px 18px #6feee216",
    minHeight: "70px",
    width: "100%",
    fontSize: "1.13rem",
  },
  usersLabel: {
    color: "#0f8a81",
    fontWeight: 800,
    fontSize: "1.17rem",
    marginBottom: "0.7rem",
    display: "block",
  },
  noAccess: {
    color: "#999",
    fontSize: "1.11rem",
    fontWeight: 600,
    marginTop: "0.7rem",
  },
  accessRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.7rem 0",
    fontSize: "1.09rem",
    color: "#08836c",
    borderBottom: "1px solid #e3f3f0",
    fontWeight: 700,
    justifyContent: "flex-start",
  },
  selectMsg: {
    color: "#b1b1b1",
    fontWeight: 500,
    fontSize: "1.3rem",
    marginTop: "6.2rem",
    textAlign: "center",
  },
  info: {
    color: "#777",
    textAlign: "center",
    fontSize: "1.23rem",
    margin: "2rem 0",
  },
};

export default ProjectAccessPage;
