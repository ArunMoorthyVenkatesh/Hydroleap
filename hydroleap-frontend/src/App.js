import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// General Components
import Landing from "./components/Landing";
import Choice from "./components/Choice";
import Login from "./components/Login";
import Register from "./components/Register";
import Notes from "./components/Notes";

// Admin Components
import AdminLoginPage from "./components/AdminLoginPage";
import AdminDashboard from "./components/AdminDashboard";
import PendingUserApproval from "./components/PendingUserApproval";
import PendingAdminApproval from "./components/PendingAdminApproval";
import ProjectAccessPage from "./components/ProjectAccessPage";
import AdminProfilePage from "./components/AdminProfilePage";

// User Components
import UserDashboard from "./components/UserDashboard";
import UserProfilePage from "./components/UserProfilePage";
import UserProjectsPage from "./components/UserProjectsPage";

// Shared Components
import AllProjects from "./components/AllProjects";
import ProjectPage from "./components/ProjectPage";
import IoTDashboard2 from "./components/IoTDashboard2";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/choose" element={<Choice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shared */}
        <Route path="/notes" element={<Notes />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/iot/:projectId" element={<IoTDashboard2 />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pending-users" element={<PendingUserApproval />} />
        <Route path="/admin/pending-admins" element={<PendingAdminApproval />} />
        <Route path="/admin/all-projects" element={<AllProjects />} />
        <Route path="/admin/project-access" element={<ProjectAccessPage />} />
        <Route path="/admin-profile" element={<AdminProfilePage />} />

        {/* User Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/user/projects" element={<UserProjectsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
