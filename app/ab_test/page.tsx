"use client";

import { useState } from "react";

type RoadRehabFormData = {
  projectName: string;
  roadName: string;
  client: string;
  designer: string;
  riskSummary: string;
  riskTypes: string;
  riskBudget: string;
};

export default function RoadRehabPage() {
  const [formData, setFormData] = useState<RoadRehabFormData>({
    projectName: "",
    roadName: "",
    client: "",
    designer: "",
    riskSummary: "",
    riskTypes: "",
    riskBudget: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  function handleChange(
    field: keyof RoadRehabFormData,
    value: string
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ab_test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.message ||
            data?.error ||
            `Request failed with status ${res.status}`
        );
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-semibold">
          RoadRehab – Pavement Design Inputs
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic project info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Project name
              </label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={formData.projectName}
                onChange={(e) =>
                  handleChange("projectName", e.target.value)
                }
                placeholder="e.g. Burma Road Rehab 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Road / site name
              </label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={formData.roadName}
                onChange={(e) =>
                  handleChange("roadName", e.target.value)
                }
                placeholder="e.g. Burma Road"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Client / RCA
              </label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={formData.client}
                onChange={(e) =>
                  handleChange("client", e.target.value)
                }
                placeholder="e.g. NZTA / Local Council"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Designer
              </label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={formData.designer}
                onChange={(e) =>
                  handleChange("designer", e.target.value)
                }
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Risk & risk profiling */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-2">
              7. Risk &amp; risk profiling
            </h2>

            <label className="block text-sm font-medium mb-1">
              Risk profile (summary)
            </label>
            <textarea
              className="w-full border rounded-md px-3 py-2 mb-3"
              rows={2}
              value={formData.riskSummary}
              onChange={(e) =>
                handleChange("riskSummary", e.target.value)
              }
              placeholder="Describe overall project risk profile: delivery risk, network risk, safety risk, etc."
            />

            <label className="block text-sm font-medium mb-1">
              Key risk types
            </label>
            <textarea
              className="w-full border rounded-md px-3 py-2 mb-3"
              rows={2}
              value={formData.riskTypes}
              onChange={(e) =>
                handleChange("riskTypes", e.target.value)
              }
              placeholder="e.g. geotechnical, drainage, constructability, traffic, stakeholder, cost escalation."
            />

            <label className="block text-sm font-medium mb-1">
              Optional – budget for risk profiling
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              value={formData.riskBudget}
              onChange={(e) =>
                handleChange("riskBudget", e.target.value)
              }
              placeholder="e.g. $1.2M, or range 1.0–1.5M, or unknown"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Generating RoadRehab design…" : "Generate RoadRehab design"}
          </button>
        </form>

        {/* Error / Output */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700">
            Request failed: {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              RoadRehab design output
            </h2>
            <pre className="text-xs bg-slate-900 text-slate-50 rounded-md p-4 overflow-auto max-h-80">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
