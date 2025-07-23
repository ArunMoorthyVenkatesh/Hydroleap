import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const PendingUserApprovalSection = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
const res = await axios.get(`${API_BASE}/admin/pending-users`);
        setPendingUsers(res.data);
        setError(null);
      } catch (err) {
        setError("Unable to fetch pending users. Please try again later.");
      }
    };
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.post(`${API_BASE}/admin/approve-user/${userId}`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("✅ User approved and added to active users.");
    } catch (err) {
      alert("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(`${API_BASE}/admin/reject-user/${userId}`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("❌ User rejected and removed from pending list.");
    } catch (err) {
      alert("Failed to reject user");
    }
  };

  return (
    <div style={styles.overlay}>
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : pendingUsers.length === 0 ? (
        <p style={styles.info}>No pending users.</p>
      ) : (
        pendingUsers.map((user) => (
          <div key={user._id} style={styles.card}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
            <p><strong>DOB:</strong> {user.dob || "N/A"}</p>
            <p><strong>Gender:</strong> {user.gender || "N/A"}</p>
            <div style={styles.buttonContainer}>
              <button onClick={() => handleApprove(user._id)} style={styles.buttonGreen}>
                Approve
              </button>
              <button onClick={() => handleReject(user._id)} style={styles.buttonRed}>
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  overlay: {
    padding: "2rem",
    color: "#222",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: "18px",
    boxShadow: "0 2px 18px rgba(30, 200, 180, 0.06)",
    maxWidth: "580px",
    margin: "0 auto"
  },
  heading: {
    marginBottom: "2rem",
    textAlign: "center",
    color: "#23c1b5",
    fontWeight: 700,
    fontSize: "2rem"
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  info: {
    textAlign: "center",
    color: "#555"
  },
  card: {
    backgroundColor: "#f8ffff",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "1.5rem",
    boxShadow: "0 0 10px rgba(30,200,180,0.06)",
  },
  buttonContainer: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  buttonGreen: {
    backgroundColor: "#23c1b5",
    color: "white",
    padding: "0.5rem 1.5rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 600,
  },
  buttonRed: {
    backgroundColor: "salmon",
    color: "white",
    padding: "0.5rem 1.5rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default PendingUserApprovalSection;
