/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

type YesNoUnknown = "yes" | "no" | "unknown";

interface RoadRehabForm {
  // 1. Project & site details
  projectName: string;
  clientRca: string;
  roadName: string;
  submitter: string;
  designDate: string;

  // 2. Location & traffic
  chainageFrom: string;
  chainageTo: string;
  rs: string;
  rp: string;
  lanes: string;
  environment: string;
  postedSpeed: string;
  aadt: string;
  heavyPercent: string;

  // 3. Existing pavement & materials
  surfaceType: string;
  subgradeCbr: string;
  structuralDataAvailable: YesNoUnknown;
  layerSummary: string;

  // 4. Condition & distress
  roughness: string;
  rutting: string;
  cracking: string;
  potholes: string;
  weakSpots: boolean;
  moistureIssues: boolean;
  safetyIssues: string;

  // 5. Design preferences & constraints
  preferredTreatment: string;
  targetDesignLife: string;
  budgetBand: string;
  constructionConstraints: string;

  // 6. Attachments & additional notes
  attachmentSummary: string;
  extraNotes: string;

  // 7. Risk & risk profiling
  riskProfileSummary: string;
  riskTypes: string;
  optionalBudget: string;
}

const INITIAL_FORM: RoadRehabForm = {
  projectName: "",
  clientRca: "",
  roadName: "",
  submitter: "",
  designDate: "",

  chainageFrom: "",
  chainageTo: "",
  rs: "",
  rp: "",
  lanes: "",
  environment: "",
  postedSpeed: "",
  aadt: "",
  heavyPercent: "",

  surfaceType: "",
  subgradeCbr: "",
  structuralDataAvailable: "unknown",
  layerSummary: "",

  roughness: "",
  rutting: "",
  cracking: "",
  potholes: "",
  weakSpots: false,
  moistureIssues: false,
  safetyIssues: "",

  preferredTreatment: "",
  targetDesignLife: "",
  budgetBand: "",
  constructionConstraints: "",

  attachmentSummary: "",
  extraNotes: "",

  riskProfileSummary: "",
  riskTypes: "",
  optionalBudget: "",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-slate-900 mt-6 mb-3">{children}</h2>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-700 mb-1">{children}</label>;
}

export default function RoadRehabPage() {
  const [form, setForm] = useState<RoadRehabForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof RoadRehabForm>(
    field: K,
    value: RoadRehabForm[K]
  ): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/roadrehab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
      const text = await res.text();
      throw new Error(
      text || `Request failed with status ${res.status}`
        );
      }    

      const data: unknown = await res.json();

      // Try to extract a useful string. Adjust based on your workflow output.
      let outputText = "";
      if (
        typeof data === "object" &&
        data !== null &&
        "output" in data &&
        typeof (data as { output: unknown }).output === "string"
      ) {
        outputText = (data as { output: string }).output;
      } else {
        outputText = JSON.stringify(data, null, 2);
      }

      setResult(outputText);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Road Rehabilitation – Design Inputs
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-3xl">
            Fill in details of your project. For information that is unknown please choose{" "}
            <span className="font-semibold">“Unknown”</span> from the drop-down boxes. Attach
            drawings, FWD files, and any further information using your preferred attachment
            method, and describe each attachment in the attachment section.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Project & site details */}
          <SectionTitle>1. Project &amp; site details</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project name</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. Burma Road Rehab 2025"
                value={form.projectName}
                onChange={(e) => updateField("projectName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Client / RCA</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. NZTA / Local Council"
                value={form.clientRca}
                onChange={(e) => updateField("clientRca", e.target.value)}
              />
            </div>
            <div>
              <Label>Road name</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. Burma Road"
                value={form.roadName}
                onChange={(e) => updateField("roadName", e.target.value)}
              />
            </div>
            <div>
              <Label>Submitter</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Your name"
                value={form.submitter}
                onChange={(e) => updateField("submitter", e.target.value)}
              />
            </div>
            <div>
              <Label>Design date</Label>
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.designDate}
                onChange={(e) => updateField("designDate", e.target.value)}
              />
            </div>
          </div>

          {/* 2. Location & traffic */}
          <SectionTitle>2. Location &amp; traffic</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>From chainage (m)</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. 0"
                value={form.chainageFrom}
                onChange={(e) => updateField("chainageFrom", e.target.value)}
              />
            </div>
            <div>
              <Label>To chainage (m)</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. 850"
                value={form.chainageTo}
                onChange={(e) => updateField("chainageTo", e.target.value)}
              />
            </div>
            <div>
              <Label>Number of lanes</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. 2"
                value={form.lanes}
                onChange={(e) => updateField("lanes", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>RS</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. RS 101"
                value={form.rs}
                onChange={(e) => updateField("rs", e.target.value)}
              />
            </div>
            <div>
              <Label>RP</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. RP 123/4"
                value={form.rp}
                onChange={(e) => updateField("rp", e.target.value)}
              />
            </div>
            <div>
              <Label>Environment</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.environment}
                onChange={(e) => updateField("environment", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="rural">Rural</option>
                <option value="urban">Urban</option>
                <option value="coastal">Coastal</option>
                <option value="mountainous">Mountainous</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label>Posted speed (km/h)</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. 80"
                value={form.postedSpeed}
                onChange={(e) => updateField("postedSpeed", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>AADT (vpd)</Label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Leave blank if unknown"
                value={form.aadt}
                onChange={(e) => updateField("aadt", e.target.value)}
              />
            </div>
            <div>
              <Label>Heavy vehicle %</Label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. 12"
                value={form.heavyPercent}
                onChange={(e) => updateField("heavyPercent", e.target.value)}
              />
            </div>
          </div>

          {/* 3. Existing pavement & materials */}
          <SectionTitle>3. Existing pavement &amp; materials</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Existing surface type</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.surfaceType}
                onChange={(e) => updateField("surfaceType", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="chip_seal">Chipseal</option>
                <option value="asphalt">Asphalt</option>
                <option value="unpaved">Unsealed / granular</option>
                <option value="composite">Composite</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label>Subgrade support (CBR)</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Select / estimate / unknown"
                value={form.subgradeCbr}
                onChange={(e) => updateField("subgradeCbr", e.target.value)}
              />
            </div>
            <div>
              <Label>Structural data available?</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.structuralDataAvailable}
                onChange={(e) =>
                  updateField("structuralDataAvailable", e.target.value as YesNoUnknown)
                }
              >
                <option value="unknown">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Summarise known layer thicknesses / materials</Label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]"
              placeholder="e.g. 40 mm AC, 150 mm GAP40, 300 mm AP65; include lab results if known."
              value={form.layerSummary}
              onChange={(e) => updateField("layerSummary", e.target.value)}
            />
          </div>

          {/* 4. Condition & distress */}
          <SectionTitle>4. Condition &amp; distress</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Roughness / ride</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.roughness}
                onChange={(e) => updateField("roughness", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="good">Good</option>
                <option value="moderate">Moderate</option>
                <option value="poor">Poor</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label>Rutting severity</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.rutting}
                onChange={(e) => updateField("rutting", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label>Cracking extent</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.cracking}
                onChange={(e) => updateField("cracking", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="isolated">Isolated</option>
                <option value="moderate">Moderate</option>
                <option value="widespread">Widespread</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label>Potholes / patches</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={form.potholes}
                onChange={(e) => updateField("potholes", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="inline-flex items-center space-x-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="rounded border-slate-300"
                checked={form.weakSpots}
                onChange={(e) => updateField("weakSpots", e.target.checked)}
              />
              <span>Weak spots present?</span>
            </label>
            <label className="inline-flex items-center space-x-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="rounded border-slate-300"
                checked={form.moistureIssues}
                onChange={(e) => updateField("moistureIssues", e.target.checked)}
              />
              <span>Moisture issues observed (pumping, flushing, water in layers)?</span>
            </label>
          </div>

          <div>
            <Label>Safety / geometry issues</Label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm min-h-[60px]"
              placeholder="e.g. tight curves, poor sight distance, narrow shoulders, drop-offs."
              value={form.safetyIssues}
              onChange={(e) => updateField("safetyIssues", e.target.value)}
            />
          </div>

          {/* 5. Design preferences & constraints */}
          <SectionTitle>5. Design preferences &amp; constraints</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Preferred treatment (if any)</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. AC overlay, dig-out, stabilisation, reseal"
                value={form.preferredTreatment}
                onChange={(e) => updateField("preferredTreatment", e.target.value)}
              />
            </div>
            <div>
              <Label>Target design life</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. 10, 20 years, unknown"
                value={form.targetDesignLife}
                onChange={(e) => updateField("targetDesignLife", e.target.value)}
              />
            </div>
            <div>
              <Label>Budget band (rough)</Label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g. low / medium / high / unknown"
                value={form.budgetBand}
                onChange={(e) => updateField("budgetBand", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Staging, traffic management or construction constraints</Label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm min-h-[60px]"
              placeholder="e.g. night works only, one-lane closure max, limited laydown area, seasonal constraints."
              value={form.constructionConstraints}
              onChange={(e) => updateField("constructionConstraints", e.target.value)}
            />
          </div>

          {/* 6. Attachments & additional notes */}
          <SectionTitle>6. Attachments &amp; additional notes</SectionTitle>
          <div>
            <Label>Attachment summary</Label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm min-h-[60px]"
              placeholder="List any files you’ve attached elsewhere: FWD export, deflection plots, condition photos, cross sections, survey, drainage plans."
              value={form.attachmentSummary}
              onChange={(e) => updateField("attachmentSummary", e.target.value)}
            />
          </div>
          <div>
            <Label>Anything else the designer should know?</Label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm min-h-[60px]"
              placeholder="Extra context, risks, or preferences."
              value={form.extraNotes}
              onChange={(e) => updateField("extraNotes", e.target.value)}
            />
          </div>

          {/* 7. Risk & risk profiling */}
          <SectionTitle>7. Risk &amp; risk profiling</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Risk profile (summary)</Label>
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm min-h-[60px]"
                placeholder="Describe overall project risk profile: delivery risk, network risk, safety risk, etc."
                value={form.riskProfileSummary}
                onChange={(e) => updateField("riskProfileSummary", e.target.value)}
              />
            </div>
            <div>
              <Label>Key risk types</Label>
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm min-h-[60px]"
                placeholder="e.g. geotechnical, drainage, constructability, traffic, stakeholder, cost escalation."
                value={form.riskTypes}
                onChange={(e) => updateField("riskTypes", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Optional – budget for risk profiling</Label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="e.g. $1.2M, or range 1.0–1.5M, or unknown"
              value={form.optionalBudget}
              onChange={(e) => updateField("optionalBudget", e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-sm disabled:opacity-60"
            >
              {loading ? "Running RoadRehab design…" : "Generate RoadRehab design"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>

        <section className="mt-6 border-t pt-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            RoadRehab design output
          </h2>
          {!result && !loading && !error && (
            <p className="text-xs text-slate-500">
              Fill out the form and run RoadRehab to see the proposed treatment design,
              layer structure, quantities concept and key risks here.
            </p>
          )}
          {result && (
            <pre className="mt-2 text-xs bg-slate-900 text-slate-50 rounded-xl p-4 overflow-auto max-h-96">
              {result}
            </pre>
          )}
        </section>
      </div>
    </main>
  );
}
