// src/components/IoTDashboard2.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIoTData } from "../api/iotApi";
import axios from "axios";
import GaugeDisplay from "./GaugeDisplay";
import BarChart from "./BarChart";
import "./IoTDashboard.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import Header from "./Header222";

const IoTDashboard2 = () => {
  const { projectId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const gaugeRef = useRef();
  const barChartRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Access denied. Please log in as admin.");
      navigate("/admin-login");
      return;
    }

    const getDeviceAndFetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/project-list/${projectId}/device`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedDeviceId = response.data.deviceId;
        if (!fetchedDeviceId) throw new Error("Device ID not found in response.");
        setDeviceId(fetchedDeviceId);

        const dataResponse = await fetchIoTData(projectId, fetchedDeviceId);
        if (!dataResponse) throw new Error("No data returned from fetchIoTData.");
        setData(dataResponse);
        setError("");
      } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        setError("Failed to load project data.");
        setData(null);
      }
    };

    getDeviceAndFetchData();
    const interval = setInterval(getDeviceAndFetchData, 1000);
    return () => clearInterval(interval);
  }, [projectId, navigate]);

  const handleDownloadPDF = async () => {
    if (!data) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text(`${projectId} - IoT Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Device ID: ${deviceId}`, 14, 30);
    doc.text(`Generated at: ${date}`, 14, 37);

    const statusRows = [
      ["System Running", data["system running"] ? "ON" : "OFF"],
      ["Pump", data.Pump_01 ? "ON" : "OFF"],
      ["Rectifier", data.Rectifier_01 ? "ON" : "OFF"]
    ];
    doc.text("Statuses", 14, 47);
    autoTable(doc, {
      startY: 50,
      head: [["Label", "Status"]],
      body: statusRows,
    });

    const gaugeRows = [];
    const gauges = [
      ["FIT-01", data.FIT_01, "m³/hr"],
      ["FIT-02", data.FIT_02, "m³/hr"],
      ["LIT-01", data.LIT_01, "m"],
      ["LIT-02", data.LIT_02, "m"],
      ["Rectifier Voltage", data.Rectifier_V, "V"],
      ["Rectifier Current", data.Rectifier_A, "A"],
      ["Temperature", data.Temperature, "C"],
      ["Pressure", data.Pressure, "barr"]
    ];
    gauges.forEach(([label, value, unit]) => {
      if (value !== undefined) {
        gaugeRows.push([label, `${value} ${unit}`]);
      }
    });

    const finalY = doc.lastAutoTable.finalY || 63;
    doc.text("Gauge Values", 14, finalY + 10);
    autoTable(doc, {
      startY: finalY + 13,
      head: [["Label", "Value"]],
      body: gaugeRows,
    });

    if (gaugeRef.current) {
      const canvas = await html2canvas(gaugeRef.current);
      const imgData = canvas.toDataURL("image/png");

      doc.addPage();
      doc.setFontSize(14);
      doc.text("Gauge Snapshot", 14, 20);
      doc.addImage(imgData, "PNG", 15, 30, 180, 110);
    }

    if (barChartRef.current) {
      const canvasBar = await html2canvas(barChartRef.current);
      const barImg = canvasBar.toDataURL("image/png");

      doc.addPage();
      doc.setFontSize(14);
      doc.text("Bar Chart Snapshot", 14, 20);
      doc.addImage(barImg, "PNG", 15, 30, 180, 110);
    }

    doc.save(`${projectId}_IoT_Report.pdf`);
  };

  // ------ UPDATED HISTORY HANDLING ------
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/project-change-logs2/${projectId}`);
      setHistory(res.data);
      setShowHistory(true);
    } catch (err) {
      console.error("❌ Failed to fetch history:", err);
      alert("Failed to load history");
    }
    setLoadingHistory(false);
  };
  // --------------------------------------

  const StatusCard = ({ label, status }) => (
    <div className="project-card">
      <div className="card-title">{label}</div>
      <div className={`status-light ${status ? "green" : "red"}`} />
    </div>
  );

  return (
    <div className="iot-dashboard-container">
      <Header />
      <h1 className="projects-title">{projectId} Dashboard</h1>
      <h4 className="device-id">Device ID: {deviceId}</h4>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <button className="report-button" onClick={() => setShowReport(!showReport)}>
          {showReport ? "Hide Report" : "Generate Report"}
        </button>
        <button className="report-button" onClick={handleDownloadPDF}>
          Download PDF
        </button>

        <button className="report-button" onClick={fetchHistory}>
          View History
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {!data ? (
        <p className="loading">Loading project data...</p>
      ) : (
        <>
          <h2 className="section-heading" style={{ textAlign: "center" }}>🔌 Status</h2>
          <div className="project-grid">
            {data["system running"] !== undefined && (
              <StatusCard label="System Running" status={data["system running"]} />
            )}
            {data.Pump_01 !== undefined && (
              <StatusCard label="Pump" status={data.Pump_01} />
            )}
            {data.Rectifier_01 !== undefined && (
              <StatusCard label="Rectifier" status={data.Rectifier_01} />
            )}
          </div>

          <h2 className="section-heading" style={{ textAlign: "center" }}>📈 Gauge Values</h2>
          <div className="gauge-grid" ref={gaugeRef}>
            {/* Gauges */}
            {[
              { label: "FIT-01", value: data.FIT_01, max: 15, unit: "m³/hr" },
              { label: "FIT-02", value: data.FIT_02, max: 15, unit: "m³/hr" },
              { label: "LIT-01", value: data.LIT_01, max: 2, unit: "m" },
              { label: "LIT-02", value: data.LIT_02, max: 2, unit: "m" },
              { label: "Rectifier Voltage", value: data.Rectifier_V, max: 30, unit: "V" },
              { label: "Rectifier Current", value: data.Rectifier_A, max: 30, unit: "A" },
              { label: "Temperature", value: data.Temperature, max: 50, unit: "C" },
              { label: "Pressure", value: data.Pressure, max: 30, unit: "barr" },
            ].map(
              ({ label, value, max, unit }) =>
                value !== undefined && (
                  <GaugeDisplay key={label} label={label} value={value} maxValue={max} unit={unit} />
                )
            )}
          </div>

          <h2 className="section-heading" style={{ textAlign: "center" }}>📊 Gauge Graphs</h2>
          <div className="gauge-grid" ref={barChartRef}>
            {/* Bar Charts */}
            {[
              { label: "FIT-01", value: data.FIT_01, max: 15, unit: "m³/hr" },
              { label: "FIT-02", value: data.FIT_02, max: 15, unit: "m³/hr" },
              { label: "LIT-01", value: data.LIT_01, max: 2, unit: "m" },
              { label: "LIT-02", value: data.LIT_02, max: 2, unit: "m" },
              { label: "Rectifier Voltage", value: data.Rectifier_V, max: 30, unit: "V" },
              { label: "Rectifier Current", value: data.Rectifier_A, max: 30, unit: "A" },
              { label: "Temperature", value: data.Temperature, max: 50, unit: "C" },
              { label: "Pressure", value: data.Pressure, max: 30, unit: "barr" },
            ].map(
              ({ label, value, max, unit }) =>
                value !== undefined && (
                  <BarChart key={label} label={label} value={value} unit={unit} maxValue={max} />
                )
            )}
          </div>

          {showReport && (
            <div className="report-section">
              <h2 className="section-heading" style={{ textAlign: "center" }}>📋 Live Report</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}

          {showHistory && (
            <div className="history-section">
              <h2 className="section-heading" style={{ textAlign: "center" }}>📜 Change History</h2>
              {loadingHistory ? (
                <p>Loading history...</p>
              ) : (
                <ul style={{ padding: "0 2rem" }}>
                  {history.map((entry, idx) => (
                    <li key={entry._id || idx} style={{ marginBottom: "1.5rem", background: "#222", padding: "1rem", borderRadius: "10px" }}>
                      <strong>🕒 {new Date(entry.changedAt).toLocaleString()}</strong>
                      <br />
                      <span>Changed by: {entry.changedBy || "unknown"}</span>
                      <pre style={{ fontSize: "0.85rem", color: "#0f0" }}>
                        {JSON.stringify(entry.oldData, null, 2)}
                      </pre>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ textAlign: "center" }}>
                <button className="report-button" onClick={() => setShowHistory(false)}>
                  Hide History
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IoTDashboard2;
