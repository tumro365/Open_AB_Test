import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI client using your Vercel env var
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const workflowId = process.env.ROADREHAB_WORKFLOW_ID;

    // Guard: make sure env var exists
    if (!workflowId) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing ROADREHAB_WORKFLOW_ID env variable",
        },
        { status: 500 }
      );
    }

    // Whatever the form sends, just forward as JSON into the workflow
    const body = await req.json();

    const run = await client.workflows.runs.create({
      workflow_id: workflowId,
      inputs: {
        type: "input_json",
        data: body,
      },
    });

    // For now just return the whole run object
    return NextResponse.json(
      {
        success: true,
        result: run,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    console.error("API route error:", error);

    return NextResponse.json(
      {
        error: true,
        message,
      },
      { status: 500 }
    );
  }
}
