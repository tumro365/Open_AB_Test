/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;

    // Try to get workflow id from the request body OR from env
    const workflowId =
      body?.workflowId || process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

    if (!workflowId) {
      return NextResponse.json(
        {
          error:
            "No workflow id found. Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your env, or include `workflowId` in the request body.",
        },
        { status: 500 }
      );
    }

    const inputs = body?.inputs ?? body ?? {};

    // --- Guard: make sure the SDK actually has workflows support ---
    const anyClient = client as any;
    if (
      !anyClient.workflows ||
      !anyClient.workflows.runs ||
      !anyClient.workflows.runs.create
    ) {
      throw new Error(
        "OpenAI SDK does not support `client.workflows` – upgrade the `openai` package (e.g. `openai@^5.1.0`)."
      );
    }

    // @ts-ignore – workflows types may lag SDK features
    const run = await anyClient.workflows.runs.create({
      workflow_id: workflowId,
      inputs,
    });

    return NextResponse.json(run, { status: 200 });
  } catch (error: any) {
    console.error("Error running workflow:", error);

    return NextResponse.json(
      {
        error: "Failed to run workflow",
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
