import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Admin = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await axios.get("http://54.165.244.9:5001/api/admin/pending-users");
        setPendingUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch pending users", err);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleApprove = async (email) => {
    try {
      await axios.post(`http://54.165.244.9:5001/api/admin/approve/${email}`);
      setPendingUsers(pendingUsers.filter((user) => user.email !== email));
      alert("User approved and notified via email.");
    } catch (err) {
      console.error(err);
      alert("Failed to approve user.");
    }
  };

  const handleReject = async (email) => {
    try {
      await axios.post(`http://54.165.244.9:5001/api/admin/reject/${email}`);
      setPendingUsers(pendingUsers.filter((user) => user.email !== email));
      alert("User rejected and notified via email.");
    } catch (err) {
      console.error(err);
      alert("Failed to reject user.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");  
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.header}>
        <h2 style={styles.title}>Pending User Approvals</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {pendingUsers.length === 0 ? (
        <p style={{ color: "white" }}>No pending users.</p>
      ) : (
        <ul style={styles.list}>
          {pendingUsers.map((user) => (
            <li key={user._id} style={styles.userItem}>
              <span>{user.email}</span>
              <div>
                <button
                  onClick={() => handleApprove(user.email)}
                  style={{ ...styles.button, backgroundColor: "green" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user.email)}
                  style={{ ...styles.button, backgroundColor: "red", marginLeft: "1rem" }}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    height: "100%",
    fontFamily: "Times New Roman, Times New Roman, serif",
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#444",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  userItem: {
    marginBottom: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#111",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Admin;
