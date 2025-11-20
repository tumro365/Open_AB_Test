/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client using your API key from env vars
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 🔑 This MUST match the key name in Vercel exactly
    const WORKFLOW_ID = process.env.ROADREHAB_WORKFLOW_ID;

    if (!WORKFLOW_ID) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing ROADREHAB_WORKFLOW_ID env variable",
        },
        { status: 500 }
      );
    }

    // Body from the form – we just forward it straight to the workflow
    const input = await req.json();

    // Call your RoadRehab workflow
    const run = await client.workflows.runs.create({
      workflow_id: WORKFLOW_ID,
      input, // this will be the JSON your page.tsx sends
    });

    // Return whatever the workflow run returns
    return NextResponse.json(run);
  } catch (err: any) {
    console.error("Error calling workflow:", err);

    return NextResponse.json(
      {
        error: true,
        message: err?.message ?? "Unknown error calling workflow",
      },
      { status: 500 }
    );
  }
}
