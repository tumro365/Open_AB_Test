/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client using your API key from Vercel env vars
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // 🔑 This MUST match the key name in Vercel exactly
    const WORKFLOW_ID = process.env.ROADREHAB_WORKFLOW_ID;

    if (!WORKFLOW_ID) {
      console.error("ROADREHAB_WORKFLOW_ID is not set in environment");
      return NextResponse.json(
        {
          error: true,
          message: "Missing ROADREHAB_WORKFLOW_ID env variable",
        },
        { status: 500 }
      );
    }

    // Body sent from page.tsx (all your form fields)
    const formData = await req.json();

    // Call your OpenAI workflow
    const run = await client.workflows.runs.create({
      workflow_id: WORKFLOW_ID,
      input: {
        form: formData,
      },
    });

    // You can either:
    // 1) just return the run (and poll separately), OR
    // 2) poll until it completes. For now, just return the run info.

    return NextResponse.json(
      {
        error: false,
        runId: run.id,
        status: run.status,
        data: run,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Route error:", err);

    return NextResponse.json(
      {
        error: true,
        message: err?.message || "Unknown error calling workflow",
      },
      { status: 500 }
    );
  }
}
