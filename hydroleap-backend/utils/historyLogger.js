const HistoryLog = require("../models/HistoryLog");

/**
 * Log a history event to the database.
 * @param {String} collectionName - e.g., 'projects'
 * @param {ObjectId} documentId
 * @param {String} action - 'create' | 'update' | 'delete'
 * @param {Object} snapshot - The full document data at the time of the event
 * @param {String} changedBy - Who made the change (email, system, etc.)
 */
async function logHistory({ collectionName, documentId, action, snapshot, changedBy }) {
  await HistoryLog.create({
    collectionName,
    documentId,
    action,
    snapshot,
    changedBy,
    changedAt: new Date()
  });
}

module.exports = { logHistory };
