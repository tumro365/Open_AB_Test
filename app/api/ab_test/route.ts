/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client using your API key from env vars
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Optional, but makes sure this runs on the server
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get workflow id from env var
    const workflowId = process.env.ROADREHAB_WORKFLOW_ID;

    if (!workflowId) {
      return NextResponse.json(
        { error: true, message: "Missing ROADREHAB_WORKFLOW_ID env variable" },
        { status: 500 }
      );
    }

    // Read JSON body from the frontend
    const body = (await request.json().catch(() => null)) as any;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: true, message: "Invalid request body" },
        { status: 400 }
      );
    }

    // We expect the frontend to POST: { formData: { ...all your fields... } }
    const input = body.formData ?? body;

    // Call the workflow
    const run = await client.beta.workflows.runs.create({
      workflow_id: workflowId,
      input, // whatever you posted from the UI
    });

    // Return the whole run object to the UI
    return NextResponse.json(run);
  } catch (err: any) {
    console.error("Error in /api/ab_test:", err);

    return NextResponse.json(
      {
        error: true,
        message: err?.message ?? "Unknown error calling workflow",
      },
      { status: 500 }
    );
  }
}
