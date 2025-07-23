const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminAuthController");

router.post("/login", loginAdmin);  // Endpoint to handle admin login

module.exports = router;
