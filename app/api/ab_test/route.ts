/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_BASE = "https://api.openai.com/v1";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    // Get workflow id from request body OR from env
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

    // Whatever the form sent in becomes inputs (or body.inputs if present)
    const inputs = body?.inputs ?? body ?? {};

    // 🔥 Call the Workflows HTTP API directly – no OpenAI SDK needed
    const resp = await fetch(`${OPENAI_API_BASE}/workflows/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        // If workflows require a beta header, this is the one.
        // Worst case, OpenAI will return a clear error and we’ll see it in `details`.
        "OpenAI-Beta": "workflows=v1",
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        inputs,
      }),
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      // Bubble up whatever OpenAI says so you can see it in DevTools → Network
      return NextResponse.json(
        {
          error: "OpenAI workflows API error",
          status: resp.status,
          details: data,
        },
        { status: 500 }
      );
    }

    // Success – send the full run object back
    return NextResponse.json(data, { status: 200 });
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
