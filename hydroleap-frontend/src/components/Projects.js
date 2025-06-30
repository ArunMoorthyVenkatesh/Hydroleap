import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import seaVideo from "../assets/sea_6.mov";
import seaVideo from "../assets/sea_2.mov";
import "./AvailableProjects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all available projects (for reference, optional depending on your app)
    axios
      .get("http://localhost:5001/api/iot/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Failed to fetch projects", err));

    // Get user email from localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      axios
        .get(`http://localhost:5001/api/projects/user/${userEmail}`)
        .then((res) => {
          if (Array.isArray(res.data.projects)) {
            setAssignedProjects(res.data.projects);
          } else {
            console.warn("Assigned projects not an array", res.data);
            setAssignedProjects([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch assigned projects", err);
          setAssignedProjects([]);
        });
    } else {
      console.warn("User email not found in localStorage");
    }
  }, []);

  return (
    <div className="project-wrapper">
      <video autoPlay muted loop className="project-video">
        <source src={seaVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="project-overlay">
        <div className="project-container">
          <h1 className="project-title">Available Projects</h1>

          {assignedProjects.length === 0 ? (
            <p className="no-projects">You don’t have access to any projects yet.</p>
          ) : (
            <div className="project-grid">
              {assignedProjects.map((projectId, index) => (
                <button
                  key={index}
                  className="project-button"
                  onClick={() => navigate(`/project/${projectId}`)}
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

export default Projects;
