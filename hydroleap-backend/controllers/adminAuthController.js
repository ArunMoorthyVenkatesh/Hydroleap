const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize the email for case-insensitive matching in MongoDB
    const normalizedEmail = email.trim().toLowerCase();

    // Find the admin by email in the database
    const admin = await Admin.findOne({ email: normalizedEmail });

    // If no admin is found
    if (!admin) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token if login is successful
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, tenantId: admin.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with the generated token and admin details
    res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        email: admin.email,
        tenantId: admin.tenantId,
      },
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { loginAdmin };
``