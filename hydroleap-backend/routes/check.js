const express = require("express");
const router = express.Router();
const checkEmailExists = require("../utils/checkEmailExists");

router.get("/check-email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const exists = await checkEmailExists(email);
    res.status(200).json({ exists });
  } catch (err) {
    console.error("❌ Email check error:", err);
    res.status(500).json({ message: "Failed to check email existence" });
  }
});

module.exports = router;
