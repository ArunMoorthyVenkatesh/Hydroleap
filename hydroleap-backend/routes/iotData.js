const express = require("express");
const router = express.Router();
const IoTData = require("../models/IoTData");
const IoTDataHistory = require("../models/IoTDataHistory");

// GET IoT data for a project and device
router.get("/:projectId/:deviceId", async (req, res) => {
  const { projectId, deviceId } = req.params;

  try {
    const data = await IoTData.findOne({ projectId, deviceId });
    if (!data) return res.status(404).json({ message: "IoT data not found" });
    res.json(data);
  } catch (err) {
    console.error("GET IoT error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update + log to history
router.put("/:projectId/:deviceId", async (req, res) => {
  const { projectId, deviceId } = req.params;
  const update = req.body;

  try {
    const updatedData = await IoTData.findOneAndUpdate(
      { projectId, deviceId },
      { ...update, projectId, deviceId },
      { upsert: true, new: true }
    );

    await IoTDataHistory.create({
      projectId,
      snapshot: updatedData.toObject(),
    });

    res.json({ message: "IoT data updated", data: updatedData });
  } catch (err) {
    console.error("PUT IoT error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// GET IoT history
router.get("/iot-history/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const history = await IoTDataHistory.find({ projectId }).sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    console.error("GET history error:", err);
    res.status(500).json({ message: "History fetch failed" });
  }
});

module.exports = router;
