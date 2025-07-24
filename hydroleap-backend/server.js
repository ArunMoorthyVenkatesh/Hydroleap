// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// --- Middleware ---
app.use(cors({
  origin: [
    "http://localhost:3000",  // Local development (React frontend)
    "http://hydroleap-iot-dashboard.s3-website-us-east-1.amazonaws.com", // S3 frontend domain
    "http://iotdashboard2.s3-website-us-east-1.amazonaws.com",  // Another S3 frontend domain
    "http://hydroleap-web-frontend.s3-website-us-east-1.amazonaws.com", // Additional frontend domain
    "http://iotdashboard2025.s3-website-us-east-1.amazonaws.com",  // Another frontend domain
        "http://hydroleap-frontend.s3-website-us-east-1.amazonaws.com",
        "http://iot-hydroleap-bucket.s3-website-us-east-1.amazonaws.com",
  "https://iot-hydroleap.com"
  ],
  credentials: true, // Allow cookies and credentials to be passed along with the request
}));

// Log incoming requests to track CORS errors
app.use((req, res, next) => {
  // Comment out in production to avoid exposing any sensitive information
  console.log(`Received request from ${req.get('Origin')}`);
  next();
});

// Ensure preflight (OPTIONS) requests are handled properly
app.options('*', cors()); // Preflight handling for all routes

// Parse incoming JSON
app.use(express.json());

// --- Route Imports ---
const otpRoutes = require("./routes/otp");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const adminRoutes = require("./routes/admin");
const userApprovalRoutes = require("./routes/userApproval");
const adminApprovalRoutes = require("./routes/adminApproval");
const adminRegisterRoutes = require("./routes/adminRegister");
const adminLoginRoutes = require("./routes/adminLogin");
const adminProfileRoutes = require("./routes/adminProfile");
const adminAuthRoutes = require("./routes/adminAuth");
const iotRoutes = require("./routes/iot2"); // ✅ Correct route import

const projectRoutes2 = require("./routes/projects2");
const projectChangeLogs2 = require("./routes/projectChangeLogs2");
const userRoutes = require("./routes/user");
const projectListRoutes = require("./routes/projectList");
const projectListRoutes_2 = require("./routes/projectList_2");
const projectAccessRoutes = require("./routes/projectAccess");
const checkRoutes = require("./routes/check");
const historyRoutes = require("./routes/history");
const userProjectsRoutes = require("./routes/userProjects");

const { startProjectHistoryWatcher } = require("./utils/changeStreamLogger");

// Optional: Project history watcher
let projectHistoryRoutes;
try {
  projectHistoryRoutes = require("./routes/projectHistory");
} catch (e) {
  projectHistoryRoutes = null;
  console.warn("⚠️ '/routes/projectHistory.js' not found, skipping.");
}

// --- Route Usage ---
app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", userApprovalRoutes);
app.use("/api/admin", adminApprovalRoutes);
app.use("/api/admin-register", adminRegisterRoutes);
app.use("/api/admin-login", adminLoginRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin", adminAuthRoutes);

app.use("/api/iot", iotRoutes); // ✅ UPDATED: This is now mounted at /api/iot

app.use("/api/projects2", projectRoutes2);
app.use("/api/project-change-logs2", projectChangeLogs2);
app.use("/api/user", userRoutes);
app.use("/api/project-list", projectListRoutes);
app.use("/api/project-list", projectListRoutes_2);
app.use("/api/projects/project-access", projectAccessRoutes); 
app.use("/api/check", checkRoutes);
app.use("/api/user-projects", userProjectsRoutes);

if (projectHistoryRoutes) {
  app.use("/api/project-history", projectHistoryRoutes);
}

app.use("/api/history", historyRoutes);

// --- Health check ---
app.get("/", (req, res) => {
  res.send("✅ Server is running with Notique & Hydroleap APIs and full historic logging!");
});

// --- MongoDB Connection ---
console.log("MongoDB URI:", process.env.MONGO_URI);  // Debug log to check MongoDB URI, REMOVE BEFORE PRODUCTION

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    if (typeof startProjectHistoryWatcher === "function") {
      startProjectHistoryWatcher(); // optional ChangeStream watcher
    }
  })
  .catch((err) => {
    console.warn("❌ MongoDB connection failed:", err.message);
  });

// --- Start Server ---
const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).send("Internal Server Error");
});
