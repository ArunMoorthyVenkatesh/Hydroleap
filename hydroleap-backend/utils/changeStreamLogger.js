const Project = require("../models/Project");
const HistoryLog = require("../models/HistoryLog");

function startProjectHistoryWatcher() {
  try {
    const changeStream = Project.watch();

    changeStream.on("change", async (change) => {
      let action;
      if (change.operationType === "insert") {
        action = "create";
      } else if (change.operationType === "delete") {
        action = "delete";
      } else if (
        change.operationType === "update" ||
        change.operationType === "replace"
      ) {
        action = "update";
      } else {
        return;
      }

      let snapshot = null;
      if (action === "delete") {
        snapshot = { _id: change.documentKey._id };
      } else {
        try {
          snapshot = await Project.findById(change.documentKey._id).lean();
        } catch (e) {
          snapshot = { _id: change.documentKey._id };
        }
      }

      await HistoryLog.create({
        collectionName: "projects",
        documentId: change.documentKey._id,
        action,
        snapshot,
        changedBy: "db-direct",
        changedAt: new Date()
      });
    });

    console.log("🔄 projects ChangeStream watcher started (history logging enabled)");
  } catch (err) {
    console.error("❌ Error starting projects ChangeStream watcher:", err.message);
  }
}

module.exports = { startProjectHistoryWatcher };
