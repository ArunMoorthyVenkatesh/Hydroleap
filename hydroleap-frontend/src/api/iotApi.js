import axios from "axios";

export const fetchIoTData = async (projectId, deviceId) => {
  const encodedDeviceId = encodeURIComponent(deviceId);
  const response = await axios.get(
    `http://localhost:5001/api/iot/${projectId}/${encodedDeviceId}`
  );
  return response.data;
};
