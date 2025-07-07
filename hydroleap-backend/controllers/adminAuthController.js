const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }


    const allowedAdminEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
    if (!allowedAdminEmails.includes(email.toLowerCase())) {
      return res.status(403).json({ message: 'Forbidden: Not an admin' });
    }


    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }


    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }


    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginAdmin };
