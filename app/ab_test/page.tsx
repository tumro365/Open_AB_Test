"use client";

import { FormEvent, useState, ChangeEvent } from "react";

// ---- Types ----

// You can extend this with more fields whenever you like.
type RoadRehabForm = {
  projectName: string;
  roadLocation: string;
  pavementCondition: string;
  trafficLoading: string;
  subgradeInfo: string;
  drainageInfo: string;
  constraints: string;
  riskSummary: string;
  riskTypes: string;
  riskBudget: string;
};

interface ApiSuccessResponse {
  success: true;
  data: unknown;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// ---- Component ----

export default function RoadRehabPage() {
  const [formData, setFormData] = useState<RoadRehabForm>({
    projectName: "",
    roadLocation: "",
    pavementCondition: "",
    trafficLoading: "",
    subgradeInfo: "",
    drainageInfo: "",
    constraints: "",
    riskSummary: "",
    riskTypes: "",
    riskBudget: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("Output will appear here after you generate a design.");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setOutput("Generating RoadRehab design…");

    try {
      const response = await fetch("/api/ab_test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: formData }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !("success" in json)) {
        setError(`Request failed with status ${response.status}`);
        setOutput("No output.");
        return;
      }

      if (!json.success) {
        setError(json.error);
        setOutput("No output.");
        return;
      }

      // Pretty-print whatever the workflow returned
      setOutput(JSON.stringify(json.data, null, 2));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error submitting form";
      setError(message);
      setOutput("No output.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold">RoadRehab Design</h1>
        <p className="mb-8 text-slate-600">
          Fill in the project details below and the RoadRehab workflow will generate
          a rehabilitation design based on your inputs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Project context */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">1. Project context</h2>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Project name / ID
              </span>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. Burma Road pavement rehab"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Road location and chainages
              </span>
              <textarea
                name="roadLocation"
                value={formData.roadLocation}
                onChange={handleChange}
                className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. RP 0.00 – 2.35 km, rural arterial, NZTA network"
              />
            </label>
          </section>

          {/* 2. Existing condition & traffic */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              2. Existing pavement & traffic
            </h2>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Pavement condition / distresses
              </span>
              <textarea
                name="pavementCondition"
                value={formData.pavementCondition}
                onChange={handleChange}
                className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. flushing, rutting to 15 mm, crocodile cracking, potholes, etc."
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Traffic loading & classification
              </span>
              <textarea
                name="trafficLoading"
                value={formData.trafficLoading}
                onChange={handleChange}
                className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. AADT 4,500 veh/day, 14% heavy, design ESA, seasonal factors…"
              />
            </label>
          </section>

          {/* 3. Ground, drainage & constraints */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              3. Ground, drainage & constraints
            </h2>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Subgrade / FWD / investigation info
              </span>
              <textarea
                name="subgradeInfo"
                value={formData.subgradeInfo}
                onChange={handleChange}
                className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. CBR values, FWD D0, curvature, lab results, weak spots, etc."
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Drainage & environment
              </span>
              <textarea
                name="drainageInfo"
                value={formData.drainageInfo}
                onChange={handleChange}
                className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. side drains, water table, climate, freeze–thaw, stormwater constraints…"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Constraints & special requirements
              </span>
              <textarea
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. night works only, staging, utilities, geotech risk, budget caps, NZTA spec notes…"
              />
            </label>
          </section>

          {/* 4. Risk & risk profiling */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">4. Risk & risk profiling</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Risk profile (summary)
                </span>
                <textarea
                  name="riskSummary"
                  value={formData.riskSummary}
                  onChange={handleChange}
                  className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Describe overall project risk profile: delivery, network, safety, etc."
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Key risk types
                </span>
                <textarea
                  name="riskTypes"
                  value={formData.riskTypes}
                  onChange={handleChange}
                  className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="e.g. geotechnical, drainage, constructability, traffic, stakeholder, cost escalation…"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Optional – budget for risk profiling
              </span>
              <input
                type="text"
                name="riskBudget"
                value={formData.riskBudget}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. $1.2M, or range 1.0–1.5M, or unknown"
              />
            </label>
          </section>

          {/* Submit button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Generating…" : "Generate RoadRehab design"}
            </button>

            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Output */}
        <section className="mt-10 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">RoadRehab design output</h2>
          <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-md bg-slate-900 p-4 text-xs text-slate-50">
            {output}
          </pre>
        </section>
      </div>
    </main>
  );
}

