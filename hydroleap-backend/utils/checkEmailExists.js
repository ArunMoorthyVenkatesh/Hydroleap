const Admin = require("../models/Admin");
const User = require("../models/User");
const PendingAdmin = require("../models/PendingAdmin");
const PendingUser = require("../models/PendingUser");

const checkEmailExists = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const [admin, user, pendingAdmin, pendingUser] = await Promise.all([
    Admin.findOne({ email: normalizedEmail }),
    User.findOne({ email: normalizedEmail }),
    PendingAdmin.findOne({ email: normalizedEmail }),
    PendingUser.findOne({ email: normalizedEmail }),
  ]);

  return !!(admin || user || pendingAdmin || pendingUser);
};

module.exports = checkEmailExists;
