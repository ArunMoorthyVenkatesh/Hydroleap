import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import seaVideo from "../assets/sea_7.mp4";
import Header from "./Header222"; // ✅ Corrected header import

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Please log in as admin to continue.");
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("Logged out successfully.");
    navigate("/admin-login");
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/list-admins");
      setAdmins(res.data);
      setView("admins");
    } catch (err) {
      alert("Failed to fetch admin list.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/list-users");
      setUsers(res.data);
      setView("users");
    } catch (err) {
      alert("Failed to fetch user list.");
    }
  };

  const handleProjectAccess = () => {
    navigate("/admin/project-access");
  };

  return (
    <div style={styles.container}>
      <video autoPlay muted loop style={styles.videoBackground}>
        <source src={seaVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={styles.content}>
        <Header /> {/* ✅ Displays role, name, email at top-left */}
        <h2 style={styles.title}>Admin Dashboard</h2>

        <div style={styles.grid}>
          <div style={styles.card} onClick={() => navigate("/admin-profile")}>
            <h3>Admin Profile</h3>
            <p>View your details as admin</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/admin/pending-users")}>
            <h3>Pending User Approval</h3>
            <p>Review and approve/reject pending user signups</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/admin/pending-admins")}>
            <h3>Pending Admin Approval</h3>
            <p>Review and approve/reject pending admin signups</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/admin/all-projects")}>
            <h3>Projects</h3>
            <p>View and manage all project dashboards</p>
          </div>

          <div style={styles.card} onClick={fetchAdmins}>
            <h3>Admin List</h3>
            <p>View all registered admins</p>
          </div>

          <div style={styles.card} onClick={fetchUsers}>
            <h3>User List</h3>
            <p>View all registered users</p>
          </div>

          <div style={styles.card} onClick={handleProjectAccess}>
            <h3>Project Access</h3>
            <p>Assign or revoke user access to projects</p>
          </div>
        </div>

        <div style={styles.logoutContainer}>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>

        {/* Admin List */}
        {view === "admins" && (
          <div style={styles.listContainer}>
            <h3 style={styles.listTitle}>Admin List</h3>
            <ul>
              {admins.map((admin, index) => (
                <li key={index} style={styles.listItem}>
                  {admin.name} — {admin.email}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* User List */}
        {view === "users" && (
          <div style={styles.listContainer}>
            <h3 style={styles.listTitle}>User List</h3>
            <ul>
              {users.map((user, index) => (
                <li key={index} style={styles.listItem}>
                  {user.name} — {user.email}
                </li>
              ))}
            </ul>
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
  logoutContainer: {
    marginTop: "3rem",
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
  listContainer: {
    marginTop: "2rem",
    background: "rgba(0,0,0,0.3)",
    padding: "1.5rem",
    borderRadius: "12px",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
  },
  listTitle: {
    marginBottom: "1rem",
    fontSize: "1.8rem",
  },
  listItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
};

export default AdminDashboard;
