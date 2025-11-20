/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client using your API key from Vercel env vars
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 🔑 This MUST match the env var name in Vercel exactly
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

    // Read JSON body from the form POST
    const body = (await req.json()) as any;

    // Support several possible shapes from the UI
    const input =
      body.formValues ?? body.formData ?? body.input ?? body.payload ?? body;

    if (!input) {
      return NextResponse.json(
        {
          error: true,
          message:
            "No input payload found in request body (expected formValues / formData / input).",
        },
        { status: 400 }
      );
    }

    // 🚀 Call your Agent Builder workflow
    const run = await client.beta.workflows.runs.create({
      workflow_id: WORKFLOW_ID,
      input, // send the full form payload into the workflow
    });

    // You can shape this however you like – for now just return the run object
    return NextResponse.json(
      {
        error: false,
        run,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Workflow API error:", err);

    return NextResponse.json(
      {
        error: true,
        message: err?.message ?? "Unknown error calling workflow",
      },
      { status: 500 }
    );
  }
}
