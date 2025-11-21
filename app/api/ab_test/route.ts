/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Expecting the client to send at least a workflowId and some inputs
    const { workflowId, inputs } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: "Missing required field: workflowId" },
        { status: 400 }
      );
    }

    // @ts-ignore – workflows is available at runtime but missing from the current OpenAI TypeScript types
    const run = await client.workflows.runs.create({
      workflow_id: workflowId,
      // This MUST match what your workflow Start node expects
      inputs: inputs ?? {},
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
