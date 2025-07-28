import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const PendingAdminApprovalSection = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingAdmins = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/pending-admins`);
        setPendingAdmins(res.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch pending admin requests.");
      }
    };
    fetchPendingAdmins();
  }, []);

  const handleDecision = async (adminId, decision) => {
    try {
      await axios.post(`${API_BASE}/admin/handle-admin-request`, {
        id: adminId,
        action: decision,
      });
      setPendingAdmins(prev => prev.filter(admin => admin._id !== adminId));
      alert(`Admin ${decision === "approve" ? "approved" : "rejected"} successfully.`);
    } catch (error) {
      alert("Action failed.");
    }
  };

  return (
    <div style={styles.overlay}>
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : pendingAdmins.length === 0 ? (
        <p style={styles.empty}>No pending admin requests.</p>
      ) : (
        <div style={styles.grid}>
          {pendingAdmins.map((admin) => (
            <div key={admin._id} style={styles.card}>
              <p><strong>Name:</strong> {admin.firstName} {admin.middleName} {admin.lastName}</p>

              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>Phone:</strong> {admin.phone}</p>
              <p><strong>DOB:</strong> {admin.dob}</p>
              <p><strong>Gender:</strong> {admin.gender}</p>
              <div style={styles.actions}>
                <button style={styles.accept} onClick={() => handleDecision(admin._id, "approve")}>Accept</button>
                <button style={styles.reject} onClick={() => handleDecision(admin._id, "reject")}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    backgroundColor: "rgba(255,255,255,0.96)",
    color: "#222",
    padding: "2rem",
    borderRadius: "18px",
    boxShadow: "0 2px 18px rgba(30, 200, 180, 0.07)",
    maxWidth: "820px",
    margin: "0 auto"
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#23c1b5"
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "1rem"
  },
  empty: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#555"
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f8ffff",
    padding: "1rem 1.2rem",
    borderRadius: "12px",
    border: "1px solid #e0f3f1",
    width: "300px",
    boxShadow: "0 2px 10px rgba(30,200,180,0.06)",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1.2rem",
  },
  accept: {
    backgroundColor: "#23c1b5",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 600,
  },
  reject: {
    backgroundColor: "salmon",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default PendingAdminApprovalSection;
