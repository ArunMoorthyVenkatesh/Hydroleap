import React, { useEffect, useState } from "react";
import axios from "axios";
import seaVideo from "../assets/sea_7.mp4";
import Header from "./Header222"; // ✅ Added Header222

const PendingUserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/admin/pending-users");
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
      await axios.post(`http://localhost:5001/api/admin/approve-user/${userId}`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("✅ User approved and added to active users.");
    } catch (err) {
      console.error("❌ Approval error:", err.response?.data || err.message);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(`http://localhost:5001/api/admin/reject-user/${userId}`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("❌ User rejected and removed from pending list.");
    } catch (err) {
      console.error("❌ Rejection error:", err.response?.data || err.message);
      alert("Failed to reject user");
    }
  };

  return (
    <div style={styles.container}>
      <video autoPlay loop muted style={styles.video}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      {/* ✅ Added Header222 */}
      <div style={styles.headerWrapper}>
        <Header />
      </div>

      <div style={styles.overlay}>
        <h2 style={styles.heading}>Pending User Approvals</h2>
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
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    overflowY: "auto",
    fontFamily: "Times New Roman",
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
  headerWrapper: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 10,
  },
  overlay: {
    padding: "2rem",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "2rem",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  info: {
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "1.5rem",
    width: "fit-content",
    margin: "0 auto",
    boxShadow: "0 0 10px rgba(255,255,255,0.2)",
  },
  buttonContainer: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  buttonGreen: {
    backgroundColor: "green",
    color: "white",
    padding: "0.5rem 1.5rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonRed: {
    backgroundColor: "red",
    color: "white",
    padding: "0.5rem 1.5rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PendingUserApproval;
