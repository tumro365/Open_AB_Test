/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

type RoadRehabFormData = {
  projectName: string;
  location: string;
  trafficDescription: string;
  existingPavement: string;
  deflectionData: string;
  cbrData: string;
  drainageDescription: string;
  constraints: string;
  riskSummary: string;
  riskTypes: string;
  riskBudget?: string;
};

export default function RoadRehabPage() {
  const [formData, setFormData] = useState<RoadRehabFormData>({
    projectName: "",
    location: "",
    trafficDescription: "",
    existingPavement: "",
    deflectionData: "",
    cbrData: "",
    drainageDescription: "",
    constraints: "",
    riskSummary: "",
    riskTypes: "",
    riskBudget: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("No output yet.");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setOutput("Generating RoadRehab design...");

    try {
      const res = await fetch("/api/ab_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.message
            ? `Request failed (${res.status}): ${data.message}`
            : `Request failed with status ${res.status}`
        );
        setOutput("No output due to error.");
        return;
      }

      setOutput(data.designText ?? "No design text was returned.");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unexpected error calling /api/ab_test");
      setOutput("No output due to error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">RoadRehab design</h1>
          <p className="text-slate-300">
            Fill in the project details and click{" "}
            <strong>Generate RoadRehab design</strong>. Your inputs are sent to
            an OpenAI model which returns a rehabilitation design.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Project info */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Project information</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Project name
              </label>
              <input
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                placeholder="e.g. Burma Road Rehabilitation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                placeholder="e.g. Town, region, chainage"
              />
            </div>
          </section>

          {/* 2. Traffic / pavement / data sections – keep it simple but you can extend later */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              2. Traffic & existing pavement
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Traffic description
              </label>
              <textarea
                name="trafficDescription"
                value={formData.trafficDescription}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={3}
                placeholder="e.g. AADT, ESA, heavy vehicles, growth, critical lanes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Existing pavement description
              </label>
              <textarea
                name="existingPavement"
                value={formData.existingPavement}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={3}
                placeholder="e.g. chipseal / asphalt layers, thicknesses, basecourse, subgrade, condition"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Investigation data</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                FWD / deflection data
              </label>
              <textarea
                name="deflectionData"
                value={formData.deflectionData}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={3}
                placeholder="e.g. D0, SCI, BDI, comments on variability"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                CBR / subgrade data
              </label>
              <textarea
                name="cbrData"
                value={formData.cbrData}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={3}
                placeholder="e.g. lab CBR, soaked CBR, assigned design CBR"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Drainage & constraints</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Drainage description
              </label>
              <textarea
                name="drainageDescription"
                value={formData.drainageDescription}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={3}
                placeholder="e.g. side drains, groundwater, surface water, known issues"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Constraints, constructability, staging
              </label>
              <textarea
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={3}
                placeholder="e.g. traffic management, utilities, staging, time windows"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Risk & risk profiling</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Risk profile (summary)
              </label>
              <textarea
                name="riskSummary"
                value={formData.riskSummary}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={2}
                placeholder="Overall project risk profile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Key risk types
              </label>
              <textarea
                name="riskTypes"
                value={formData.riskTypes}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                rows={2}
                placeholder="e.g. geotechnical, drainage, constructability, traffic, stakeholder, cost escalation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Optional – budget for risk profiling
              </label>
              <input
                name="riskBudget"
                value={formData.riskBudget}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                placeholder="e.g. $1.2M, or range 1.0–1.5M, or unknown"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate RoadRehab design"}
          </button>

          {error && (
            <p className="mt-4 rounded bg-red-100/10 border border-red-500 text-red-200 px-4 py-2">
              {error}
            </p>
          )}
        </form>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">
            RoadRehab design output
          </h2>
          <div className="rounded border border-slate-700 bg-slate-900 px-4 py-3 whitespace-pre-wrap text-sm">
            {output}
          </div>
        </section>
      </div>
    </main>
  );
}
