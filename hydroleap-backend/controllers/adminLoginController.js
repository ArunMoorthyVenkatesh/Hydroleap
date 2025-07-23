const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query the database directly for the admin email (case-insensitive lookup)
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // If no admin is found
    if (!admin) {
      return res.status(404).json({ message: `Admin with email ${email} not found` });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token if login is successful
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Respond with the token
    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginAdmin };
