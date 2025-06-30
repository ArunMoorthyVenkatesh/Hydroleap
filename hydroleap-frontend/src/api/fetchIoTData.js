import axios from "axios";

export const   = async (projectId, deviceId) => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.get(
      `http://localhost:5001/api/iot/${projectId}/${deviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching IoT data:", error);
    throw new Error("Failed to fetch IoT data.");
  }
};
