const Admin = require("../models/Admin"); 


const fetchAdminEmails = async () => {
  try {
    const admins = await Admin.find({}, "email");  
    return admins.map(admin => admin.email.trim().toLowerCase());
  } catch (error) {
    console.error("❌ Failed to fetch admin emails from DB:", error);
    return []; 
  }
};

module.exports = fetchAdminEmails;
