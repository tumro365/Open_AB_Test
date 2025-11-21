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

    // Be forgiving about the shape:
    //  - if caller sent { inputs: {...} } we use that
    //  - otherwise we just send the whole body as inputs
    const inputs = body?.inputs ?? body ?? {};

    // @ts-ignore – workflows is available at runtime but missing from the current OpenAI TypeScript types
    const run = await client.workflows.runs.create({
      workflow_id: workflowId,
      inputs,
    });

    return NextResponse.json(run, { status: 200 });
  } catch (error: any) {
    console.error("Error running workflow:", error);

    // Surface a slightly more helpful error back to the frontend
    return NextResponse.json(
      {
        error: "Failed to run workflow",
        // This won't show in your button UI, but will be visible in the browser Network tab
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
