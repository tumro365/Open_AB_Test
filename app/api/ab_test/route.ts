/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Must match your Vercel env var EXACTLY
    const workflowId = process.env.ROADREHAB_WORKFLOW_ID;

    if (!workflowId) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing ROADREHAB_WORKFLOW_ID env variable",
        },
        { status: 500 }
      );
    }

    // Read JSON body from form submit
    const input: any = await req.json();

    // Create workflow run
    const run = await client.workflows.runs.create({
      workflow_id: workflowId,
      input,
    });

    return NextResponse.json(
      {
        error: false,
        run,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: true,
        message: err?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}
