import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AvailableProjects.css"; // style this file as needed

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/iot/projects")
      .then((res) => {
        console.log("All projects fetched:", res.data);
        setProjects(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch all projects", err);
        setProjects([]);
      });
  }, []);

  return (
    <div className="project-wrapper">


      <div className="project-overlay">
        <div className="project-container">
          <h1 className="project-title">All Projects</h1>

          {projects.length === 0 ? (
            <p className="no-projects">No projects found.</p>
          ) : (
            <div className="project-grid">
              {projects.map((projectId, index) => (
                <button
                  key={index}
                  className="project-button"
                  onClick={() => navigate(`/iot/${projectId}`)}
                >
                  {projectId}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;