/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    // Try to read from env first…
    const envWorkflowId = process.env.WORKFLOW_ID;

    // …but fall back to your actual workflow ID so it still works
    const workflowId =
      envWorkflowId ??
      "wf_691535f232648190a99f5d4903e5838b0131b49e328a026a";

    if (!apiKey) {
      return NextResponse.json(
        { error: true, message: "Missing OPENAI_API_KEY env variable" },
        { status: 500 }
      );
    }

    if (!workflowId) {
      // This should never happen now, because of the fallback above
      return NextResponse.json(
        {
          error: true,
          message: "Missing WORKFLOW_ID env variable",
        },
        { status: 500 }
      );
    }

    const openaiRes = await fetch(
      `https://api.openai.com/v1/workflows/${workflowId}/runs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "OpenAI-Beta": "workflows=v1",
        },
        body: JSON.stringify({
          // send the full form payload to the workflow
          input: body,
        }),
      }
    );

    const text = await openaiRes.text();

    if (!openaiRes.ok) {
      return NextResponse.json(
        {
          error: true,
          status: openaiRes.status,
          details: text || "Failed calling OpenAI workflow",
        },
        { status: openaiRes.status }
      );
    }

    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // If OpenAI ever returns plain text instead of JSON
      return NextResponse.json({ raw: text }, { status: 200 });
    }

    return NextResponse.json(json, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/ab_test:", err);
    return NextResponse.json(
      {
        error: true,
        message: err?.message || "Unknown error in /api/ab_test",
      },
      { status: 500 }
    );
  }
}
