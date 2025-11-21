/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client using your API key from env vars
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // This MUST match the key name in Vercel exactly  
    const WORKFLOW_ID = process.env.ROADREHAB_WORKFLOW_ID;

    if (!WORKFLOW_ID) {
      return NextResponse.json(
        { error: true, message: "Missing ROADREHAB_WORKFLOW_ID env variable" },
        { status: 500 }
      );
    }

    // Parse the JSON body from the UI form
    const body = await req.json();

    // Start the workflow run
    const run = await client.workflows.runs.create({
      workflow_id: WORKFLOW_ID,
      inputs: body, // ← JSON payload from UI
    });

    // Return the workflow run ID so we can poll for completion
    return NextResponse.json({ success: true, runId: run.id });
  } catch (err: any) {
    console.error("Workflow error:", err);
    return NextResponse.json(
      { error: true, message: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
