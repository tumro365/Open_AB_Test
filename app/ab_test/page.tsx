/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

export default function AbTestPage() {
  const [form, setForm] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Handle input changes
  const updateField = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit handler
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

  return (
    <div style={{ padding: "3rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>
        RoadRehab Input Form
      </h1>

      {/* SECTION 1: Project name */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label>Project Name</label>
        <input
          type="text"
          style={{ width: "100%", padding: "10px" }}
          onChange={(e) => updateField("projectName", e.target.value)}
        />
      </div>

      {/* SECTION 2: Project location */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label>Project Location</label>
        <input
          type="text"
          style={{ width: "100%", padding: "10px" }}
          onChange={(e) => updateField("projectLocation", e.target.value)}
        />
      </div>

      {/* SECTION 3: Any other fields you want — add freely */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label>Other Details</label>
        <textarea
          style={{ width: "100%", padding: "10px", height: 80 }}
          onChange={(e) => updateField("otherDetails", e.target.value)}
        />
      </div>

      {/* EXAMPLE risk section */}
      <h2 style={{ marginTop: "2rem" }}>7. Risk & Risk Profiling</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>Risk Profile (summary)</label>
        <textarea
          style={{ width: "100%", padding: "10px", height: 80 }}
          onChange={(e) => updateField("riskSummary", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>Key Risk Types</label>
        <textarea
          style={{ width: "100%", padding: "10px", height: 80 }}
          onChange={(e) => updateField("riskTypes", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>Optional Budget for Risk Profiling</label>
        <input
          type="text"
          style={{ width: "100%", padding: "10px" }}
          onChange={(e) => updateField("riskBudget", e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          padding: "12px 24px",
          backgroundColor: "#001f3f",
          color: "white",
          borderRadius: 8,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {isLoading ? "Generating..." : "Generate RoadRehab design"}
      </button>

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#ffe6e6",
            color: "#a30000",
            borderRadius: 8,
          }}
        >
          ⚠️ Request failed: {error}
        </div>
      )}

      {/* Output */}
      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>RoadRehab Design Output</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f4f4f4",
              padding: "1rem",
              borderRadius: 8,
              marginTop: "1rem",
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
