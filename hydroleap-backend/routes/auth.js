const express = require("express");
const router = express.Router();
const { requestSignup, loginUser } = require("../controllers/authController");

router.post("/request-signup", requestSignup);
router.post("/login", loginUser);

module.exports = router;
