require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://iotdashboard2.s3-website-us-east-1.amazonaws.com"
  ],
  credentials: true,
}));

app.use(express.json()); // Parse incoming JSON

// --- Route Imports ---
const otpRoutes = require("./routes/otp");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const adminRoutes = require("./routes/admin");
const adminRegisterRoutes = require("./routes/adminRegister");
const userApprovalRoutes = require("./routes/userApproval");
const adminApprovalRoutes = require("./routes/adminApproval");
const adminLoginRoutes = require("./routes/adminLogin");
const adminProfileRoutes = require("./routes/adminProfile");
const adminAuthRoutes = require("./routes/adminAuth");
const iotRoutes = require("./routes/iot2");

const projectRoutes2 = require("./routes/projects2");
const projectChangeLogs2 = require("./routes/projectChangeLogs2");
const userRoutes = require("./routes/user");
const projectListRoutes = require("./routes/projectList");
const projectListRoutes_2 = require("./routes/projectList_2");
const projectAccessRoutes = require("./routes/projectAccess"); // <-- Project Access
const checkRoutes = require("./routes/check");
const historyRoutes = require("./routes/history");
const { startProjectHistoryWatcher } = require("./utils/changeStreamLogger");  
const userProjectsRoutes = require("./routes/userProjects");

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
app.use("/api/iot", iotRoutes);

app.use("/api/projects2", projectRoutes2);
app.use("/api/project-change-logs2", projectChangeLogs2);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/project-list", projectListRoutes);
app.use("/api/project-list", projectListRoutes_2);
// FIX: Mount at /api/projects/project-access so your frontend works!
app.use("/api/projects/project-access", projectAccessRoutes); 
app.use("/api/check", checkRoutes);
app.use("/api/user-projects", userProjectsRoutes);

if (projectHistoryRoutes) {
  app.use("/api/project-history", projectHistoryRoutes);
}

app.use("/api/history", historyRoutes);

// --- Default root endpoint ---
app.get("/", (req, res) => {
  res.send("✅ Server is running with Notique & Hydroleap APIs and full historic logging!");
});

// --- Mongoose Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // Start history watcher (optional)
    if (typeof startProjectHistoryWatcher === "function") {
      startProjectHistoryWatcher();
    }
  })
  .catch((err) => console.warn("❌ MongoDB connection failed:", err.message));

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
