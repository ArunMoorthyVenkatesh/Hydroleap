// src/api/iotApi.js
import axios from "axios";

export const   = async (projectId, plc) => {
  const response = await axios.get(`http://54.165.244.9:5001/api/iot/${projectId}/${plc}`);
  return response.data;
};
