import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI client using your Vercel env var
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Minimal type describing just the workflow bit we need
type WorkflowClient = {
  workflows: {
    runs: {
      create: (args: {
        workflow_id: string;
        inputs: { type: "input_json"; data: unknown };
      }) => Promise<unknown>;
    };
  };
};

// Tell TypeScript to treat the client as a WorkflowClient for this route
const wfClient = client as unknown as WorkflowClient;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
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

    const body = await req.json();

    const run = await wfClient.workflows.runs.create({
      workflow_id: workflowId,
      inputs: {
        type: "input_json",
        data: body,
      },
    });

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
