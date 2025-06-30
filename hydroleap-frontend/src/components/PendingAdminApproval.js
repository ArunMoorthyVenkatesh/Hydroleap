import React, { useEffect, useState } from "react";
import axios from "axios";
import Header222 from "./Header222"; // ✅ Updated to Header222
import seaVideo from "../assets/sea_7.mp4";

const PendingAdminApproval = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);

  useEffect(() => {
    const fetchPendingAdmins = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/admin/pending-admins");
        setPendingAdmins(res.data);
      } catch (error) {
        console.error("Error fetching pending admins:", error);
      }
    };

    fetchPendingAdmins();
  }, []);

  const handleDecision = async (adminId, decision) => {
    try {
      await axios.post(`http://localhost:5001/api/admin/handle-admin-request`, {
        id: adminId,
        action: decision,
      });

      setPendingAdmins(prev => prev.filter(admin => admin._id !== adminId));
      alert(`Admin ${decision === "approve" ? "approved" : "rejected"} successfully.`);
    } catch (error) {
      console.error("Error processing request:", error);
      alert("Action failed.");
    }
  };

  return (
    <div style={styles.container}>
      <video autoPlay loop muted style={styles.video}>
        <source src={seaVideo} type="video/mp4" />
      </video>
      <div style={styles.overlay}>
        <Header222 /> {/* ✅ Header222 placed here */}
        <h2 style={styles.title}>Pending Admin Approvals</h2>
        {pendingAdmins.length === 0 ? (
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
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    overflowY: "auto",
    fontFamily: "Times New Roman, serif",
  },
  video: {
    position: "fixed",
    top: 0,
    left: 0,
    minWidth: "100%",
    minHeight: "100%",
    objectFit: "cover",
    zIndex: -1,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    minHeight: "100vh",
    color: "#fff",
    padding: "2rem",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    fontSize: "1.2rem",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#111",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid #444",
    width: "300px",
    backdropFilter: "blur(6px)",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
  accept: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  reject: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PendingAdminApproval;
