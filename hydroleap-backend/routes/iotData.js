const express = require("express");
const router = express.Router();
const IoTData = require("../models/IoTData");
const IoTDataHistory = require("../models/IoTDataHistory");

// ✅ GET: Fetch IoT data for a specific project and device
router.get("/:projectId/:deviceId", async (req, res) => {
  const { projectId, deviceId } = req.params;

  try {
    const data = await IoTData.findOne({ projectId, deviceId });

    if (!data) {
      return res.status(404).json({ message: `IoT data not found for projectId=${projectId}, deviceId=${deviceId}` });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ GET IoT error:", err);
    res.status(500).json({ message: "Server error while fetching IoT data" });
  }
});

// ✅ PUT: Update or insert IoT data and log it to history
router.put("/:projectId/:deviceId", async (req, res) => {
  const { projectId, deviceId } = req.params;
  const update = req.body;

  try {
    const updatedData = await IoTData.findOneAndUpdate(
      { projectId, deviceId },
      { ...update, projectId, deviceId },
      { upsert: true, new: true }
    );

    // Log to history
    await IoTDataHistory.create({
      projectId,
      deviceId,
      snapshot: updatedData.toObject(),
      changedAt: new Date()
    });

    res.status(200).json({ message: "✅ IoT data updated", data: updatedData });
  } catch (err) {
    console.error("❌ PUT IoT error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ GET: Fetch recent history logs for a project
router.get("/iot-history/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const history = await IoTDataHistory.find({ projectId })
      .sort({ changedAt: -1 })
      .limit(50); // return most recent 50 changes

    res.status(200).json(history);
  } catch (err) {
    console.error("❌ GET history error:", err);
    res.status(500).json({ message: "Failed to fetch IoT history" });
  }
});

module.exports = router;