import React, { useEffect, useState } from "react";
import {
  FiMenu, FiUsers, FiUserCheck, FiUserPlus,
  FiClipboard, FiList, FiLogOut
} from "react-icons/fi";
import seaVideo from "../assets/sea_7.mp4";
import Header from "./Header222";
import axios from "axios";
import "./AdminDashboard.css";
import AdminProfileSection from './AdminProfileSection';
import PendingUserApproval from './PendingUserApproval';
import PendingAdminApproval from './PendingAdminApproval';
import AllProjects from './AllProjects';
import ProjectAccessPage from './ProjectAccessPage';
import hydroleapLogo from "../assets/hydroleap-logo.png"; 

const SIDEBAR_ITEMS = [
  { key: "profile", icon: <FiUsers />, label: "Admin Profile" },
  { key: "pending-users", icon: <FiUserCheck />, label: "Pending User Approval" },
  { key: "pending-admins", icon: <FiUserPlus />, label: "Pending Admin Approval" },
  { key: "projects", icon: <FiClipboard />, label: "Projects" },
  { key: "admins", icon: <FiList />, label: "Admin List" },
  { key: "users", icon: <FiList />, label: "User List" },
  { key: "project-access", icon: <FiClipboard />, label: "Project Access" }
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("profile");
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorAdmins, setErrorAdmins] = useState("");
  const [errorUsers, setErrorUsers] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Please log in as admin to continue.");
      window.location.href = "/admin-login";
    }
  }, []);

  useEffect(() => {
    if (active === "admins") fetchAdmins();
    if (active === "users") fetchUsers();
    setErrorAdmins("");
    setErrorUsers("");
    // eslint-disable-next-line
  }, [active]);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const res = await axios.get("http://localhost:5001/api/admin/list-admins");
      setAdmins(res.data);
      setErrorAdmins("");
    } catch {
      setAdmins([]);
      setErrorAdmins("Failed to fetch admin list.");
    }
    setLoadingAdmins(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get("http://localhost:5001/api/admin/list-users");
      setUsers(res.data);
      setErrorUsers("");
    } catch {
      setUsers([]);
      setErrorUsers("Failed to fetch user list.");
    }
    setLoadingUsers(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("Logged out successfully.");
    window.location.href = "/admin-login";
  };

  function renderSection() {
    switch (active) {
      case "profile":
        return (
          <SectionBlock title="Admin Profile">
            <p>View your details as admin.</p>
             <AdminProfileSection />
          </SectionBlock>
        );
      case "pending-users":
        return (
          <SectionBlock title="Pending User Approval">
            <p>Review and approve/reject pending user signups.</p>
            <PendingUserApproval />
          </SectionBlock>
        );
      case "pending-admins":
        return (
          <SectionBlock title="Pending Admin Approval">
            <p>Review and approve/reject pending admin signups.</p>
            <PendingAdminApproval />
          </SectionBlock>
        );
      case "projects":
        return (
          <SectionBlock title="Projects">
            <p>View and manage all project dashboards.</p>
            <AllProjects />
          </SectionBlock>
        );
      case "admins":
        return (
          <SectionBlock title="Admin List">
            {loadingAdmins ? <LoadingSpinner /> : null}
            {errorAdmins && <p className="error-message">{errorAdmins}</p>}
            <ul>
              {admins.length === 0 && !errorAdmins ? (
                <li>No admins found.</li>
              ) : (
                admins.map((a, i) => (
                  <li key={i}>
                    <b>{a.name}</b> — {a.email}
                  </li>
                ))
              )}
            </ul>
          </SectionBlock>
        );
      case "users":
        return (
          <SectionBlock title="User List">
            {loadingUsers ? <LoadingSpinner /> : null}
            {errorUsers && <p className="error-message">{errorUsers}</p>}
            <ul>
              {users.length === 0 && !errorUsers ? (
                <li>No users found.</li>
              ) : (
                users.map((u, i) => (
                  <li key={i}>
                    <b>{u.name}</b> — {u.email}
                  </li>
                ))
              )}
            </ul>
          </SectionBlock>
        );
      case "project-access":
        return (
          <SectionBlock title="Project Access">
            <p>Assign or revoke user access to projects.</p>
            <ProjectAccessPage />
          </SectionBlock>
        );
      default:
        return <SectionBlock title="Admin Dashboard">Welcome to the Admin Dashboard.</SectionBlock>;
    }
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#f4f8fa" }}>
      {/* Video background */}
      <video autoPlay muted loop style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        objectFit: "cover", zIndex: -1, opacity: 0.20
      }}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      {/* Header */}
      <div style={{
        position: "absolute",
        top: 24,
        left: sidebarOpen ? 210 : 60,
        zIndex: 10,
        transition: "left 0.2s"
      }}>
        <Header />
      </div>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}
        style={{
          position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100,
          background: "#fff", boxShadow: "2px 0 16px #1dc3a711", minHeight: "100vh",
          width: sidebarOpen ? 200 : 54, transition: "width 0.2s",
          display: "flex", flexDirection: "column"
        }}
      >
        {/* LOGO at top */}
        <div style={{
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", paddingTop: 18, paddingBottom: sidebarOpen ? 16 : 4
}}>
  <img
    src={hydroleapLogo}
    alt="Hydroleap Logo"
    style={{
      width: sidebarOpen ? 98 : 48,
      height: sidebarOpen ? 98 : 48,
      boxShadow: "0 2px 10px #23c1b51a",
      marginBottom: sidebarOpen ? 10 : 0,
      transition: "width 0.2s, height 0.2s, margin-bottom 0.2s"
    }}
  />
</div>

        <button
          className="sidebar-toggle"
          style={{
            background: "none", border: "none", outline: "none", cursor: "pointer",
            fontSize: 24, margin: "18px 0 18px 12px", color: "#23c1b5"
          }}
          onClick={() => setSidebarOpen(o => !o)}
        >
          <FiMenu />
        </button>
        <nav style={{ flex: 1 }}>
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              className={`sidebar-link ${active === item.key ? "active" : ""}`}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", background: "none",
                border: "none", outline: "none", padding: "12px 18px", fontSize: 16,
                color: active === item.key ? "#23c1b5" : "#376872", fontWeight: active === item.key ? 700 : 500,
                borderRadius: 8, marginBottom: 6,
                backgroundColor: active === item.key ? "#dff6f6" : "transparent",
                transition: "background 0.18s, color 0.18s"
              }}
              onClick={() => setActive(item.key)}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <button
          className="sidebar-link"
          style={{
            background: "#23c1b5", color: "#fff", fontWeight: 700,
            border: "none", outline: "none", margin: "24px 18px", borderRadius: 8,
            display: "flex", alignItems: "center", gap: 10, fontSize: 16, padding: "10px 14px"
          }}
          onClick={handleLogout}
        >
          <FiLogOut />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: sidebarOpen ? 200 : 54,
          transition: "margin 0.2s",
          padding: "32px 20px 16px 20px"
        }}
      >
        <div style={{
          maxWidth: 1320,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 6px 30px #009f8d19",
          padding: "34px 32px",
          minHeight: "720px",
          overflow: "visible"
        }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div>
      <h2 style={{
        fontSize: "2.2rem",
        marginBottom: "1.5rem",
        fontWeight: "700",
        color: "#23c1b5"
      }}>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

function LoadingSpinner() {
  return <div style={{ padding: "1.5rem", textAlign: "center" }}>Loading...</div>;
}
