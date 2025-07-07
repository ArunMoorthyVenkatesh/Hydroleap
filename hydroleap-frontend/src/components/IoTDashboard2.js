import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIoTData } from "../api/iotApi";
import axios from "axios";
import GaugeDisplay from "./GaugeDisplay";
import GraphWithTimeFilter from "./GraphWithTimeFilter";
import { FiPower, FiDroplet, FiZap, FiThermometer } from "react-icons/fi";
import "./IoTDashboard.css";
import ReportSection from "./ReportSection";


const FIELD_LABELS = {
  FIT_01: "FIT-01 (Flow 1, m³/hr)",
  FIT_02: "FIT-02 (Flow 2, m³/hr)",
  LIT_01: "LIT-01 (Level 1, m)",
  LIT_02: "LIT-02 (Level 2, m)",
  Rectifier_V: "Rectifier Voltage (V)",
  Rectifier_A: "Rectifier Current (A)",
  Temperature: "Temperature (°C)",
  Pressure: "Pressure (bar)",
};

const GAUGE_META = [
  { field: "FIT_01", label: FIELD_LABELS.FIT_01, max: 15, unit: "m³/hr" },
  { field: "FIT_02", label: FIELD_LABELS.FIT_02, max: 15, unit: "m³/hr" },
  { field: "LIT_01", label: FIELD_LABELS.LIT_01, max: 2, unit: "m" },
  { field: "LIT_02", label: FIELD_LABELS.LIT_02, max: 2, unit: "m" },
  { field: "Rectifier_V", label: FIELD_LABELS.Rectifier_V, max: 30, unit: "V" },
  { field: "Rectifier_A", label: FIELD_LABELS.Rectifier_A, max: 30, unit: "A" },
  { field: "Temperature", label: FIELD_LABELS.Temperature, max: 50, unit: "°C" },
  { field: "Pressure", label: FIELD_LABELS.Pressure, max: 10, unit: "bar" },
];

function HeaderBar() {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img
          src={require("../assets/hydroleap-logo.png")}
          alt="Hydroleap Logo"
          className="dashboard-logo"
        />
        <span className="dashboard-title">Dashboard</span>
      </div>
    </header>
  );
}

function ProjectInfoBar({ projectId, deviceId }) {
  return (
    <div className="project-info-bar">
      <span>
        Project: <strong className="project-accent">{projectId}</strong>
      </span>
      <span>
        Device ID: <strong>{deviceId}</strong>
      </span>
    </div>
  );
}

function StatusCard({ icon, label, value, color }) {
  return (
    <div className="status-card">
      <span className="status-icon">{icon}</span>
      <div className="status-label">{label}</div>
      <div className="status-value" style={{ color }}>{value}</div>
    </div>
  );
}

function AuditTrail({ history }) {
  return (
    <div className="audit-trail">
      <div className="audit-title">Audit Trail</div>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Changed By</th>
            <th>Time</th>
            <th>Snapshot</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, i) => (
            <tr key={i}>
              <td>{entry.action?.toUpperCase()}</td>
              <td>{entry.changedBy || "unknown"}</td>
              <td>{new Date(entry.changedAt).toLocaleString()}</td>
              <td className="json-cell">{JSON.stringify(entry.snapshot, null, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const realTimeFields = [
  { key: "Temperature", label: "Temperature (°C)", icon: <FiThermometer />, color: "#e07c24" },
  { key: "Pressure", label: "Pressure (bar)", icon: null, color: "#2b2d42" },
  { key: "FIT_01", label: "FIT-01 (m³/hr)", icon: null, color: "#37a2ff" },
  { key: "FIT_02", label: "FIT-02 (m³/hr)", icon: null, color: "#45db97" },
  { key: "LIT_01", label: "LIT-01 (m)", icon: null, color: "#fcaf3e" },
  { key: "LIT_02", label: "LIT-02 (m)", icon: null, color: "#ff6384" },
  { key: "Rectifier_V", label: "Rectifier Voltage (V)", icon: null, color: "#9d5eea" },
  { key: "Rectifier_A", label: "Rectifier Current (A)", icon: null, color: "#e07c24" },
];

const systemMeta = [
  {
    key: "system running",
    label: "System Running",
    icon: <FiPower />,
    color: "#14ba85"
  },
  {
    key: "Pump_01",
    label: "Pump",
    icon: <FiDroplet />,
    color: "#24a1e0"
  },
  {
    key: "Rectifier_01",
    label: "Rectifier",
    icon: <FiZap />,
    color: "#f78c2c"
  }
];

const ALL_HISTORIC_FIELDS = [
  ...GAUGE_META.map(meta => ({ key: meta.field, label: meta.label })),
  ...systemMeta.map(meta => ({ key: meta.key, label: meta.label })),
];

const IoTDashboard2 = () => {
  const { projectId } = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [history, setHistory] = useState([]);
  const [dataView, setDataView] = useState("realtime"); // "realtime" | "historic" | "audit" | "report"
  const [subView, setSubView] = useState("numeric"); // "numeric" | "gauge"
  const [selectedHistoric, setSelectedHistoric] = useState([]);
  const [historicData] = useState({});
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDeviceId(response.data.deviceId);
        setData(await fetchIoTData(projectId, response.data.deviceId));
      } catch (err) {
        setError("Failed to load project data.");
        setData({});
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/history/byProjectId/${projectId}`);
        setHistory(res.data);
      } catch (err) {}
    };

    getDeviceAndFetchData();
    fetchHistory();

    const interval = setInterval(() => {
      getDeviceAndFetchData();
      fetchHistory();
    }, 10000);
    return () => clearInterval(interval);
  }, [projectId, navigate]);

  // ======== HISTORIC DATA FROM AUDIT LOG ========

  // Build a time series for each field using history snapshots
  const historicDataFromHistory = {};
  ALL_HISTORIC_FIELDS.forEach(({ key }) => {
    historicDataFromHistory[key] = history
      .filter(entry => entry.snapshot && typeof entry.snapshot[key] === "number")
      .map(entry => ({
        time: entry.changedAt,
        value: entry.snapshot[key]
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));
  });

  // Only show fields with real data
  const availableHistoricFields = ALL_HISTORIC_FIELDS.filter(
    f => Array.isArray(historicDataFromHistory[f.key]) && historicDataFromHistory[f.key].length > 0
  );

  // ============= REPORT VIEW =============


  return (
    <div className="dashboard-root">
      <HeaderBar />
      <ProjectInfoBar
        projectId={projectId}
        deviceId={deviceId}
      />

      {/* ----- Main 4-way toggle ----- */}
      <div className="section-title-toggle-row">
        <div className="toggle-switch-row-centered">
          <div className="toggle-switch-row">
            <button
              className={dataView === "realtime" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setDataView("realtime")}
            >
              Real Time Data
            </button>
            <button
              className={dataView === "historic" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setDataView("historic")}
            >
              Historic Data
            </button>
            <button
              className={dataView === "audit" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setDataView("audit")}
            >
              Audit Trail
            </button>
            <button
              className={dataView === "report" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setDataView("report")}
            >
              Report
            </button>
          </div>
        </div>
        {dataView === "realtime" && (
          <div className="toggle-switch-row-centered" style={{marginTop: 0}}>
            <div className="toggle-switch-row">
              <button
                className={subView === "numeric" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setSubView("numeric")}
              >
                Numeric View
              </button>
              <button
                className={subView === "gauge" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setSubView("gauge")}
              >
                Gauge View
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Views ---------- */}

      {dataView === "report" && (
  <ReportSection
    projectId={projectId}
    deviceId={deviceId}
    data={data}
    history={history}
    historicData={historicData}
    ALL_HISTORIC_FIELDS={ALL_HISTORIC_FIELDS}
    systemMeta={systemMeta}
    GAUGE_META={GAUGE_META}
  />
)}


      {dataView === "realtime" && (
        subView === "numeric" ? (
          <div className="status-cards-row" style={{ flexWrap: "wrap" }}>
            {systemMeta
              .filter(meta => data[meta.key] !== undefined && data[meta.key] !== null)
              .map(meta => (
                <StatusCard
                  key={meta.key}
                  icon={meta.icon}
                  label={meta.label}
                  value={
                    typeof data[meta.key] === "boolean"
                      ? data[meta.key]
                        ? "ON"
                        : "OFF"
                      : "N/A"
                  }
                  color={
                    typeof data[meta.key] === "boolean"
                      ? data[meta.key]
                        ? meta.color
                        : "#ef233c"
                      : "#8e99ad"
                  }
                />
              ))}
            {realTimeFields
              .filter(meta => data[meta.key] !== undefined && data[meta.key] !== null && data[meta.key] !== "N/A")
              .map(meta => (
                <StatusCard
                  key={meta.key}
                  icon={meta.icon}
                  label={meta.label}
                  value={typeof data[meta.key] === "number" ? data[meta.key] : data[meta.key]}
                  color={meta.color}
                />
              ))}
          </div>
        ) : (
          <>
            <div className="status-cards-row" style={{ justifyContent: "center" }}>
              {systemMeta
                .filter(meta => typeof data[meta.key] === "boolean")
                .map(meta => (
                  <div
                    key={meta.key}
                    className="status-card"
                    style={{
                      borderBottom: `4px solid ${data[meta.key] ? "#14ba85" : "#ef233c"}`,
                    }}
                  >
                    <span className="status-icon">{meta.icon}</span>
                    <div className="status-label">{meta.label}</div>
                    <div className="status-indicator-wrapper">
                      <span
                        className={
                          "status-indicator " +
                          (data[meta.key] ? "on-circle" : "off-circle")
                        }
                        title={data[meta.key] ? "ON" : "OFF"}
                      ></span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="metrics-grid">
              {GAUGE_META
                .filter(meta => typeof data[meta.field] === "number")
                .map(meta => (
                  <div key={meta.field} style={{ textAlign: "center" }}>
                    <GaugeDisplay
                      label={meta.label}
                      value={data[meta.field]}
                      maxValue={meta.max}
                      unit={meta.unit}
                    />
                  </div>
                ))}
            </div>
          </>
        )
      )}

      {/* Historic Data: only show fields with data */}
      {dataView === "historic" && (
        <div className="historic-wrapper">
<div className="historic-controls">
  <div style={{ marginBottom: 4 }}>
    <label className="pretty-checkbox" style={{ fontWeight: 600, color: "#0d5751" }}>
      <input
        type="checkbox"
        checked={selectedHistoric.length === availableHistoricFields.length}
        onChange={() => {
          if (selectedHistoric.length === availableHistoricFields.length) {
            setSelectedHistoric([]);
          } else {
            setSelectedHistoric(availableHistoricFields.map(f => f.key));
          }
        }}
      />
      <span className="custom-check" />
      View All
    </label>
  </div>
  <div className="historic-checkboxes">
    {availableHistoricFields.map(f => (
      <label key={f.key} className="pretty-checkbox historic-checkbox-label">
        <input
          type="checkbox"
          checked={selectedHistoric.includes(f.key)}
          onChange={() =>
            setSelectedHistoric(sel =>
              sel.includes(f.key)
                ? sel.filter(k => k !== f.key)
                : [...sel, f.key]
            )
          }
        />
        <span className="custom-check" />
        {f.label}
      </label>
    ))}
  </div>
</div>


          <div className="historic-graphs-grid">
            {selectedHistoric.length === 0 && (
              <div className="historic-placeholder" style={{ marginTop: 40 }}>
                <em>Select data to view graphs.</em>
              </div>
            )}
            {selectedHistoric
              .filter(key =>
                Array.isArray(historicDataFromHistory[key]) && historicDataFromHistory[key].length > 0
              )
              .map(key => {
                const label =
                  availableHistoricFields.find(f => f.key === key)?.label || key;
                const color = "#0088FE";
                const points = historicDataFromHistory[key];
                return (
                  <div key={key} className="historic-graph-card">
                    <GraphWithTimeFilter
                      data={points}
                      label={label}
                      color={color}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {dataView === "audit" && (
        <div className="audit-trail-row" style={{ justifyContent: "center" }}>
          <AuditTrail history={history.slice(-15).reverse()} />
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default IoTDashboard2;
