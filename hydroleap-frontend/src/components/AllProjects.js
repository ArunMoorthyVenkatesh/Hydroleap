import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllProjects.css"; // keep your styles!

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
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
        const res = await axios.get("http://54.165.244.9:5001/api/project-list/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        setError("Failed to load project list.");
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleClick = (projectId) => {
    navigate(`/iot/${projectId}`);
  };

  return (
    <>


      <div className="all-projects-content">
        {error ? (
          <p className="error-message">{error}</p>
        ) : projects.length === 0 ? (
          <p className="no-projects">No projects found.</p>
        ) : (
          <div className="project-grid">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="project-card"
                onClick={() => handleClick(proj.projectId)}
              >
                <h3>{proj.projectId}</h3>
                <p><strong>Device:</strong> {proj.deviceId || "N/A"}</p>
                <p><strong>Running:</strong> {proj["system running"] ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllProjects;
