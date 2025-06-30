require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // Parses incoming JSON requests

// ✅ Route imports
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
const projectRoutes = require("./routes/projects");
const projectRoutes2 = require("./routes/projects2"); // 🚨 NEW Project2 route
const projectChangeLogs2 = require("./routes/projectChangeLogs2"); // 🚨 NEW ProjectChangeLog2 route
const userRoutes = require("./routes/user");
const projectListRoutes = require("./routes/projectList");
const projectListRoutes_2 = require("./routes/projectList_2");
const projectAccessRoutes = require("./routes/projectAccess");
const checkRoutes = require("./routes/check");

// ✅ Route Usage
app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", userApprovalRoutes);
app.use("/api/admin", adminApprovalRoutes);
app.use("/api/admin-register", adminRegisterRoutes);
app.use("/api/admin-login", adminLoginRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects2", projectRoutes2); // 🚨 NEW Project2 route
app.use("/api/project-change-logs2", projectChangeLogs2); // 🚨 NEW ProjectChangeLog2 route
app.use("/api/user", userRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/project-list", projectListRoutes);
app.use("/api/project-list", projectListRoutes_2);
app.use("/api/project-access", projectAccessRoutes);
app.use("/api/check", checkRoutes);

app.get("/", (req, res) => {
  res.send("✅ Server is running with Notique & Hydroleap APIs and Project2 feature!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.warn("❌ MongoDB connection failed:", err.message));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
