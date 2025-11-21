/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Run this route on the edge like the starter
export const runtime = "edge";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const workflowId = process.env.ROADREHAB_WORKFLOW_ID;
    if (!workflowId) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing ROADREHAB_WORKFLOW_ID env variable",
        },
        { status: 500 },
      );
    }

    // We expect the front-end to send { payload: ... }
    const body = (await req.json()) as { payload: unknown };

    // Turn whatever we get into a single string for `input_as_text`
    let inputText: string;

    if (typeof body.payload === "string") {
      inputText = body.payload;
    } else {
      // nice pretty JSON the agent can read
      inputText = JSON.stringify(body.payload, null, 2);
    }

    const run = await client.workflows.runs.create({
      workflow_id: workflowId,
      inputs: {
        // 🔑 this MUST match the Start node input name
        input_as_text: inputText,
      },
    });

    // For workflows with "Text" output format, this will be populated
    const output = (run as any).output_text ?? (run as any).output ?? null;

    return NextResponse.json(
      {
        success: true,
        output,
        runId: run.id,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("Error calling workflow:", err);

    let message = "Unknown error";
    if (err && typeof err === "object" && "message" in err) {
      message = String((err as any).message);
    }

    return NextResponse.json(
      {
        error: true,
        message,
      },
      { status: 400 },
    );
  }
}
