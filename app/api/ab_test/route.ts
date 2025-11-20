/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // same style as the chatkit starter

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.WORKFLOW_ID; // 👈 set this in Vercel env

    if (!apiKey) {
      return NextResponse.json(
        { error: true, message: "Missing OPENAI_API_KEY env variable" },
        { status: 500 }
      );
    }

    if (!workflowId) {
      return NextResponse.json(
        { error: true, message: "Missing WORKFLOW_ID env variable" },
        { status: 500 }
      );
    }

    // Call the OpenAI Workflows API
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
          // The entire form payload from page.tsx
          input: body,
        }),
      }
    );

    const text = await openaiRes.text();

    if (!openaiRes.ok) {
      // Bubble up error details so you can see them in the UI
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
      // If response isn’t valid JSON, just return raw text
      return NextResponse.json({ raw: text }, { status: 200 });
    }

    // You can reshape this if your workflow returns a specific structure,
    // but for now we just pass it straight back to the frontend.
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
