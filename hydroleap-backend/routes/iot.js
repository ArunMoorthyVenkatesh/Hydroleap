const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const docClient = new AWS.DynamoDB.DocumentClient();

// GET /api/iot/projects
router.get("/projects", async (req, res) => {
  const params = {
    TableName: "Projects", // Replace with your DynamoDB table name
    ProjectionExpression: "projectId",
  };

  try {
    const data = await docClient.scan(params).promise();
    const projectIds = data.Items.map((item) => item.projectId);
    res.json(projectIds);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ message: "Failed to retrieve projects" });
  }
});

module.exports = router;
