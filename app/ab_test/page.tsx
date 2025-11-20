/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

export default function RoadRehabPage() {
  const [projectName, setProjectName] = useState("");
  const [aadt, setAadt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/roadrehab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: {
            project_name: projectName,
            aadt: Number(aadt) || null,
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      // for now just show the raw JSON text
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center items-start px-4 py-10">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        <h1 className="text-2xl font-semibold">Road Rehabilitation – Demo Form</h1>
        <p className="text-sm text-slate-600">
          This is a minimal test: project name + AADT. When you submit, it will call your
          OpenAI workflow and display the result below. Once this works, we’ll swap in the
          full design form.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project name</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Burma Road Rehab 2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">AADT (vpd)</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={aadt}
              onChange={(e) => setAadt(e.target.value)}
              placeholder="e.g. 3500"
              type="number"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Running workflow..." : "Submit"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Workflow response</h2>
          {!result && !loading && (
            <p className="text-sm text-slate-500">
              Submit the form to see the workflow response here.
            </p>
          )}
          {result && (
            <pre className="bg-slate-900 text-slate-50 text-xs rounded-lg p-4 overflow-auto max-h-80">
              {result}
            </pre>
          )}
        </section>
      </div>
    </main>
  );
}
