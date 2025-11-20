/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

type FormState = {
  // 1. Project & site details
  projectName?: string;
  clientRca?: string;
  roadName?: string;
  submitter?: string;
  designDate?: string;

  // 2. Location & traffic
  fromChainage?: string;
  toChainage?: string;
  lanes?: string;
  rs?: string;
  rp?: string;
  environment?: string;
  postedSpeed?: string;
  aadt?: string;
  heavyVehiclePercent?: string;

  // 3. Existing pavement & materials
  existingSurfaceType?: string;
  subgradeCbr?: string;
  structuralDataAvailable?: string;
  layerSummary?: string;

  // 4. Condition & distress
  roughness?: string;
  rutting?: string;
  cracking?: string;
  potholes?: string;
  weakSpotsPresent?: boolean;
  moistureIssuesObserved?: boolean;
  safetyIssues?: string;

  // 5. Design preferences & constraints
  preferredTreatment?: string;
  targetDesignLife?: string;
  budgetBand?: string;
  stagingConstraints?: string;

  // 6. Attachments & notes
  attachmentSummary?: string;
  extraNotes?: string;

  // 7. Risk & risk profiling
  riskSummary?: string;
  riskTypes?: string;
  riskBudget?: string;
};

const initialForm: FormState = {};

export default function RoadRehabPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const updateField = (field: keyof FormState, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ab_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(
          text || `Request failed with status ${res.status}`
        );
      }

      const json = text ? JSON.parse(text) : null;
      setResult(JSON.stringify(json, null, 2));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const sectionStyle: React.CSSProperties = {
    borderTop: "1px solid #eee",
    paddingTop: "1.5rem",
    marginTop: "1.5rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 500,
    marginBottom: "0.3rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    borderRadius: 8,
    border: "1px solid #d0d0d0",
    fontSize: "0.95rem",
  };

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginTop: "0.75rem",
  };

  return (
    <div
      style={{
        padding: "2.5rem 1.5rem 3rem",
        maxWidth: 1000,
        margin: "0 auto",
        fontFamily: "-apple-system, system-ui, sans-serif",
      }}
    >
      {/* Title */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Road Rehabilitation – Design Inputs
        </h1>
        <p style={{ color: "#555", fontSize: "0.98rem", maxWidth: 800 }}>
          Fill in details of your project. For information that is unknown, please choose
          from the drop-down boxes or type “unknown”. Attach drawings, FWD files, and any
          further information you have using the attachment button, and describe each
          attachment in the attachments section.
        </p>
      </header>

      {/* 1. Project & site details */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          1. Project &amp; site details
        </h2>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Project name</label>
            <input
              style={inputStyle}
              placeholder="e.g. Burma Road Rehab 2025"
              onChange={(e) => updateField("projectName", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Client / RCA</label>
            <input
              style={inputStyle}
              placeholder="e.g. NZTA / Local Council"
              onChange={(e) => updateField("clientRca", e.target.value)}
            />
          </div>
        </div>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Road name</label>
            <input
              style={inputStyle}
              placeholder="e.g. Burma Road"
              onChange={(e) => updateField("roadName", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Submitter</label>
            <input
              style={inputStyle}
              placeholder="Your name"
              onChange={(e) => updateField("submitter", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Design date</label>
            <input
              type="date"
              style={inputStyle}
              onChange={(e) => updateField("designDate", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 2. Location & traffic */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          2. Location &amp; traffic
        </h2>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>From chainage (m)</label>
            <input
              style={inputStyle}
              placeholder="e.g. 0"
              onChange={(e) => updateField("fromChainage", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>To chainage (m)</label>
            <input
              style={inputStyle}
              placeholder="e.g. 850"
              onChange={(e) => updateField("toChainage", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Number of lanes</label>
            <input
              style={inputStyle}
              placeholder="e.g. 2 or unknown"
              onChange={(e) => updateField("lanes", e.target.value)}
            />
          </div>
        </div>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>RS</label>
            <input
              style={inputStyle}
              placeholder="Route position RS"
              onChange={(e) => updateField("rs", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>RP</label>
            <input
              style={inputStyle}
              placeholder="Route position RP"
              onChange={(e) => updateField("rp", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Environment</label>
            <input
              style={inputStyle}
              placeholder="Urban / rural / coastal, etc."
              onChange={(e) => updateField("environment", e.target.value)}
            />
          </div>
        </div>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Posted speed (km/h)</label>
            <input
              style={inputStyle}
              placeholder="e.g. 80"
              onChange={(e) => updateField("postedSpeed", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>AADT (vpd)</label>
            <input
              style={inputStyle}
              placeholder="number or unknown"
              onChange={(e) => updateField("aadt", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Heavy vehicle %</label>
            <input
              style={inputStyle}
              placeholder="number or estimate"
              onChange={(e) => updateField("heavyVehiclePercent", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 3. Existing pavement & materials */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          3. Existing pavement &amp; materials
        </h2>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Existing surface type</label>
            <input
              style={inputStyle}
              placeholder="e.g. chipseal, AC, composite"
              onChange={(e) => updateField("existingSurfaceType", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Subgrade support (CBR)</label>
            <input
              style={inputStyle}
              placeholder="value, range, or unknown"
              onChange={(e) => updateField("subgradeCbr", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Structural data available?</label>
            <input
              style={inputStyle}
              placeholder="FWD, deflection, cores, none, etc."
              onChange={(e) => updateField("structuralDataAvailable", e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label style={labelStyle}>
            Summarise any known layer thicknesses or materials
          </label>
          <textarea
            style={{ ...inputStyle, height: 90 }}
            placeholder="e.g. 40 mm AC, 150 mm GAP40, 300 mm AP65; include any lab results."
            onChange={(e) => updateField("layerSummary", e.target.value)}
          />
        </div>
      </section>

      {/* 4. Condition & distress */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          4. Condition &amp; distress
        </h2>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Roughness / ride</label>
            <input
              style={inputStyle}
              placeholder="e.g. good / fair / poor or IRI values"
              onChange={(e) => updateField("roughness", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Rutting severity</label>
            <input
              style={inputStyle}
              placeholder="e.g. low / moderate / high or mm"
              onChange={(e) => updateField("rutting", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Cracking extent</label>
            <input
              style={inputStyle}
              placeholder="e.g. isolated / widespread / wheelpath"
              onChange={(e) => updateField("cracking", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Potholes / patches</label>
            <input
              style={inputStyle}
              placeholder="Describe frequency / severity"
              onChange={(e) => updateField("potholes", e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: "0.75rem", display: "flex", gap: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              onChange={(e) => updateField("weakSpotsPresent", e.target.checked)}
            />
            Weak spots present?
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              onChange={(e) =>
                updateField("moistureIssuesObserved", e.target.checked)
              }
            />
            Moisture issues observed (pumping, flushing, water in layers)?
          </label>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label style={labelStyle}>Safety / geometry issues</label>
          <textarea
            style={{ ...inputStyle, height: 70 }}
            placeholder="e.g. tight curves, poor sight distance, narrow shoulders, drop-offs."
            onChange={(e) => updateField("safetyIssues", e.target.value)}
          />
        </div>
      </section>

      {/* 5. Design preferences & constraints */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          5. Design preferences &amp; constraints
        </h2>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Preferred treatment (if any)</label>
            <input
              style={inputStyle}
              placeholder="Or leave blank / unknown"
              onChange={(e) => updateField("preferredTreatment", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Target design life</label>
            <input
              style={inputStyle}
              placeholder="e.g. 10, 15, 25 years"
              onChange={(e) => updateField("targetDesignLife", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Budget band (rough)</label>
            <input
              style={inputStyle}
              placeholder="e.g. &lt; $1M, $1–2M, &gt; $2M, etc."
              onChange={(e) => updateField("budgetBand", e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label style={labelStyle}>
            Staging, traffic management or construction constraints
          </label>
          <textarea
            style={{ ...inputStyle, height: 80 }}
            placeholder="e.g. night works only, one-lane closure max, limited laydown area, seasonal constraints."
            onChange={(e) => updateField("stagingConstraints", e.target.value)}
          />
        </div>
      </section>

      {/* 6. Attachments & additional notes */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          6. Attachments &amp; additional notes
        </h2>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>Attachment summary</label>
          <textarea
            style={{ ...inputStyle, height: 80 }}
            placeholder="List any files you’ve attached in chat: e.g. FWD export, deflection plots, condition photos, cross sections, survey, drainage plans."
            onChange={(e) => updateField("attachmentSummary", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Anything else the designer should know?</label>
          <textarea
            style={{ ...inputStyle, height: 80 }}
            placeholder="Extra context, risks, or preferences."
            onChange={(e) => updateField("extraNotes", e.target.value)}
          />
        </div>
      </section>

      {/* 7. Risk & risk profiling */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          7. Risk &amp; risk profiling
        </h2>
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Risk profile (summary)</label>
            <textarea
              style={{ ...inputStyle, height: 80 }}
              placeholder="Describe overall project risk profile: delivery risk, network risk, safety risk, etc."
              onChange={(e) => updateField("riskSummary", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Key risk types</label>
            <textarea
              style={{ ...inputStyle, height: 80 }}
              placeholder="e.g. geotechnical, drainage, constructability, traffic, stakeholder, cost escalation."
              onChange={(e) => updateField("riskTypes", e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label style={labelStyle}>Optional – budget for risk profiling</label>
          <input
            style={inputStyle}
            placeholder="e.g. $1.2M, or range 1.0–1.5M, or unknown"
            onChange={(e) => updateField("riskBudget", e.target.value)}
          />
        </div>
      </section>

      {/* Submit button */}
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            padding: "0.8rem 1.8rem",
            borderRadius: 999,
            border: "none",
            background: "#001f3f",
            color: "white",
            fontWeight: 600,
            cursor: isLoading ? "default" : "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          }}
        >
          {isLoading ? "Generating RoadRehab design…" : "Generate RoadRehab design"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem 1.2rem",
            background: "#ffecec",
            color: "#a00000",
            borderRadius: 10,
            fontSize: "0.95rem",
          }}
        >
          ⚠️ Request failed: {error}
        </div>
      )}

      {/* Output */}
      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          RoadRehab design output
        </h2>
        <pre
          style={{
            marginTop: "0.75rem",
            background: "#f6f6f6",
            padding: "1rem",
            borderRadius: 10,
            whiteSpace: "pre-wrap",
            fontSize: "0.9rem",
          }}
        >
          {result || "Output will appear here after you generate a design."}
        </pre>
      </section>
    </div>
  );
}
