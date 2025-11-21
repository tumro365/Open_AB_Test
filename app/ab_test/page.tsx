"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

type RoadRehabForm = {
  [key: string]: string;
};

const initialForm: RoadRehabForm = {
  projectName: "",
  roadName: "",
  location: "",
  trafficVolumes: "",
  heavyVehiclePercent: "",
  pavementCondition: "",
  deflectionData: "",
  structuralIssues: "",
  drainageIssues: "",
  constraints: "",
  designObjectives: "",
  preferredTreatmentTypes: "",
  budgetRange: "",
  programmeConstraints: "",
  riskSummary: "",
  keyRiskTypes: "",
  riskBudget: "",
};

export default function RoadRehabPage() {
  const [formData, setFormData] = useState<RoadRehabForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setOutput("");

    try {
      const response = await fetch("/api/ab_test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as { message?: unknown }).message === "string"
            ? ((data as { message: string }).message)
            : "Request failed";

        throw new Error(message);
      }

      // Try to extract something readable from the workflow result
      let textOutput = "";

      if (
        typeof data === "object" &&
        data !== null &&
        "result" in data
      ) {
        const result = (data as { result?: unknown }).result;

        if (
          typeof result === "object" &&
          result !== null &&
          "output" in result &&
          typeof (result as { output?: unknown }).output === "string"
        ) {
          textOutput = (result as { output: string }).output;
        }
      }

      if (!textOutput) {
        textOutput = JSON.stringify(data, null, 2);
      }

      setOutput(textOutput);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold">
        RoadRehab design form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Project details */}
        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">1. Project details</h2>

          <label className="block text-sm font-medium">
            Project name
            <input
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm font-medium">
            Road name / route
            <input
              name="roadName"
              value={formData.roadName}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm font-medium">
            Location
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>
        </section>

        {/* 7. Risk & risk profiling – the section you screenshot */}
        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">
            7. Risk &amp; risk profiling
          </h2>

          <label className="block text-sm font-medium">
            Risk profile (summary)
            <textarea
              name="riskSummary"
              value={formData.riskSummary}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              rows={3}
              placeholder="Describe overall project risk profile: delivery risk, network risk, safety risk, etc."
            />
          </label>

          <label className="block text-sm font-medium">
            Key risk types
            <textarea
              name="keyRiskTypes"
              value={formData.keyRiskTypes}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              rows={3}
              placeholder="e.g. geotechnical, drainage, constructability, traffic, stakeholder, cost escalation."
            />
          </label>

          <label className="block text-sm font-medium">
            Optional – budget for risk profiling
            <input
              name="riskBudget"
              value={formData.riskBudget}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              placeholder="e.g. $1.2M, or range 1.0–1.5M, or unknown"
            />
          </label>
        </section>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-sky-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? "Generating design…" : "Generate RoadRehab design"}
        </button>
      </form>

      <section className="mt-8 space-y-3">
        {error && (
          <p className="rounded border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <h2 className="text-lg font-semibold">
          RoadRehab design output
        </h2>

        <pre className="min-h-[160px] whitespace-pre-wrap rounded border bg-slate-50 p-4 text-sm">
          {output || "Output will appear here after you generate a design."}
        </pre>
      </section>
    </main>
  );
}
