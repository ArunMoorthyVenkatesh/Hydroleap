import React, { useState, useMemo, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import html2pdf from "html2pdf.js";
import hydroleapLogo from "../assets/hydroleap-logo.png"; // Import your logo
import "./ReportSection.css";

// Field label map
const FIELD_LABELS = {
  FIT_01: "FIT-01 (Flow 1, m³/hr)",
  FIT_02: "FIT-02 (Flow 2, m³/hr)",
  LIT_01: "LIT-01 (Level 1, m)",
  LIT_02: "LIT-02 (Level 2, m)",
  Rectifier_V: "Rectifier Voltage (V)",
  Rectifier_A: "Rectifier Current (A)",
  Temperature: "Temperature (°C)",
  Pressure: "Pressure (bar)",
  "system running": "System Running",
  Pump_01: "Pump",
  Rectifier_01: "Rectifier"
};
const ALL_FIELDS = Object.keys(FIELD_LABELS);

function HistoricGraph({ data, label }) {
  if (!data || !data.length) return null;
  const chartData = data.map(d => ({
    time: new Date(d.time).toLocaleString(),
    value: d.value
  }));
  return (
    <div style={{ margin: "14px 0 12px 0" }}>
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} minTickGap={18} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00afa2" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ReportSection({
  projectId,
  deviceId,
  data,
  history
}) {
  const [view, setView] = useState("realtime"); // "realtime" | "historic"
  const [selectedFields, setSelectedFields] = useState([]);
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const reportRef = useRef();

  const availableRTFields = ALL_FIELDS.filter(
    key => data && data[key] !== undefined && data[key] !== null
  );

  const historyMap = useMemo(() => {
    const result = {};
    ALL_FIELDS.forEach(key => {
      result[key] = (history || [])
        .filter(entry => entry.snapshot && typeof entry.snapshot[key] === "number")
        .map(entry => ({
          time: entry.changedAt,
          value: entry.snapshot[key]
        }))
        .sort((a, b) => new Date(a.time) - new Date(b.time));
    });
    return result;
  }, [history]);

  const availableHistoricFields = ALL_FIELDS.filter(
    key => historyMap[key] && historyMap[key].length > 0
  );
  const fieldList = view === "realtime" ? availableRTFields : availableHistoricFields;

  const filteredHistoricData = key => {
    if (!historyMap[key]) return [];
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    return historyMap[key].filter(
      d => new Date(d.time) >= from && new Date(d.time) <= to
    );
  };

  const allSelected = selectedFields.length === fieldList.length && fieldList.length > 0;
  const handleSelectAll = () => {
    setSelectedFields(allSelected ? [] : [...fieldList]);
  };
  const handleSelectField = key => {
    setSelectedFields(sel =>
      sel.includes(key) ? sel.filter(k => k !== key) : [...sel, key]
    );
  };

  // ---- PDF download logic ----
  function handleDownloadPDF() {
    if (!reportRef.current) return;
    // Hide buttons for PDF (optionally)
    const buttons = reportRef.current.querySelectorAll(".no-print");
    buttons.forEach(btn => btn.style.display = "none");
    html2pdf()
      .set({
        filename: `${projectId}_${view}_report.pdf`,
        margin: [12, 10],
        image: { type: "jpeg", quality: 0.99 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
      })
      .from(reportRef.current)
      .save()
      .then(() => {
        // Restore button display
        buttons.forEach(btn => btn.style.display = "");
      });
  }

  return (
<div style={{ maxWidth: 860, margin: "0 auto" }}>
<div
        ref={reportRef}
        style={{
          background: "#fff",
          borderRadius: 22,
          boxShadow: "0 4px 32px 0 #009f8d0c",
          padding: "36px 32px 30px 32px",
          position: "relative"
        }}
      >
        {/* ==== LOGO TOP RIGHT ==== */}
        <img
          src={hydroleapLogo}
          alt="Hydroleap Logo"
          className="report-logo"
          style={{
            position: "absolute",
            top: 24,
            right: 32,
            width: 120,
            height: "auto",
            objectFit: "contain",
            zIndex: 10
          }}
        />
        {/* ======================== */}
        <h2 style={{ marginBottom: 2 }}>
          {projectId} - Custom Report
        </h2>
        <div style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 18 }}>
          Device ID: <strong>{deviceId}</strong>
        </div>
        <div className="toggle-switch-row-centered" style={{ margin: "12px 0 22px 0" }}>
          <div className="toggle-switch-row">
            <button
              className={view === "realtime" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => { setView("realtime"); setSelectedFields([]); }}
            >
              Real Time Data
            </button>
            <button
              className={view === "historic" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => { setView("historic"); setSelectedFields([]); }}
            >
              Historic Data
            </button>
          </div>
        </div>
        {view === "historic" && (
          <div style={{ margin: "8px 0 18px 0", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span>Timeline:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ padding: "5px", borderRadius: 6, border: "1px solid #eee" }}
            />
            <span>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ padding: "5px", borderRadius: 6, border: "1px solid #eee" }}
            />
          </div>
        )}
        <div style={{ marginBottom: 18 }}>
          <label className="pretty-checkbox" style={{ fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
            />
            <span className="custom-check"></span>
            Select All
          </label>
          <div className="report-checkboxes">
            {fieldList.map(f => (
              <label key={f} className="pretty-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(f)}
                  onChange={() => handleSelectField(f)}
                />
                <span className="custom-check"></span>
                {FIELD_LABELS[f]}
              </label>
            ))}
          </div>
        </div>
        {selectedFields.length === 0 && (
          <div style={{ margin: "44px 0 20px 0", color: "#888", textAlign: "center", fontStyle: "italic" }}>
            {fieldList.length === 0
              ? "No fields available."
              : "Select data to view."}
          </div>
        )}
        {selectedFields.map(key => (
          <div key={key} style={{ marginBottom: 32 }}>
            {view === "historic" && (
              <HistoricGraph
                data={filteredHistoricData(key)}
                label={FIELD_LABELS[key]}
              />
            )}
            <div>
              <div style={{ fontWeight: 600, marginTop: 7 }}>{FIELD_LABELS[key]}</div>
              <table className="report-table" style={{ marginTop: 6 }}>
                <thead>
                  <tr>
                    <th>{view === "realtime" ? "Label" : "Date/Time"}</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {view === "realtime" ? (
                    <tr>
                      <td>{FIELD_LABELS[key]}</td>
                      <td>{data[key] !== undefined ? String(data[key]) : "--"}</td>
                    </tr>
                  ) : (
                    (filteredHistoricData(key) || []).length === 0 ? (
                      <tr><td colSpan={2}><em>No data for this range.</em></td></tr>
                    ) : (
                      filteredHistoricData(key).map((d, idx) => (
                        <tr key={idx}>
                          <td>{new Date(d.time).toLocaleString()}</td>
                          <td>{d.value}</td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          className="download-btn no-print"
          style={{
            background: "#fff", border: "2px solid #009f8d", color: "#212",
            borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: "1.1rem",
            cursor: selectedFields.length === 0 ? "not-allowed" : "pointer",
            opacity: selectedFields.length === 0 ? 0.5 : 1
          }}
          onClick={handleDownloadPDF}
          disabled={selectedFields.length === 0}
        >
          Download Report
        </button>
      </div>
    </div>
  );
}
