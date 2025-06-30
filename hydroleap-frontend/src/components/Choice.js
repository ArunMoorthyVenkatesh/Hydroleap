import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import seaVideo from "../assets/sea_1.mp4";

const Choice = () => {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  const handleNavigation = (path) => {
    setFade(true);  
    setTimeout(() => navigate(path), 500);  
  };

  return (
    <div style={{ ...styles.container, opacity: fade ? 0 : 1, transition: "opacity 0.5s ease" }}>
       <video autoPlay loop muted style={styles.video}>
        <source src={seaVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

       <div style={styles.overlay}>
        <Header />
        <div style={styles.centerBox}>
          <button onClick={() => handleNavigation("/login")} style={styles.button}>
            Login
          </button>
          <button onClick={() => handleNavigation("/register")} style={styles.button}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "Times New Roman, serif",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    width: "100%",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  centerBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1.2rem",
    width: "100%",
  },
  button: {
    padding: "0.75rem 2rem",
    border: "1px solid #fff",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    color: "#fff",
    fontSize: "1.1rem",
    cursor: "pointer",
    width: "200px",
    transition: "all 0.3s",
  },
};

export default Choice;
