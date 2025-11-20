/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();

    // This should match the input variable name in your workflow Start node
    const workflowInputs = {
      input_as_text: JSON.stringify(body, null, 2),
    };

    const run = await client.workflows.runs.create({
      workflow_id: WORKFLOW_ID,
      inputs: workflowInputs,
    });

    // Poll until the workflow finishes
    let result = await client.workflows.runs.get(run.id);

    while (result.status === "running" || result.status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      result = await client.workflows.runs.get(run.id);
    }

    if (result.status !== "completed") {
      return NextResponse.json(
        {
          error: true,
          message: `Workflow failed with status: ${result.status}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: false,
        result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      {
        error: true,
        message: err?.message ?? "Unknown error",
        details: err,
      },
      { status: 500 }
    );
  }
}
