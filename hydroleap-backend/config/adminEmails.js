const Admin = require("../models/Admin"); // adjust the path as needed

// Function to fetch all admin emails from the database
const fetchAdminEmails = async () => {
  try {
    const admins = await Admin.find({}, "email"); // fetch only the email field
    return admins.map(admin => admin.email.trim().toLowerCase());
  } catch (error) {
    console.error("❌ Failed to fetch admin emails from DB:", error);
    return []; // fallback to empty list
  }
};

module.exports = fetchAdminEmails;
