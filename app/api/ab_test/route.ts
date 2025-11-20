/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

interface RoadRehabFormPayload {
  [key: string]: unknown;
}

const WORKFLOW_ID = process.env.ROADREHAB_WORKFLOW_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!WORKFLOW_ID) {
      return new NextResponse("ROADREHAB_WORKFLOW_ID is not set", { status: 500 });
    }
    if (!OPENAI_API_KEY) {
      return new NextResponse("OPENAI_API_KEY is not set", { status: 500 });
    }

    const form: RoadRehabFormPayload = (await req.json()) as RoadRehabFormPayload;

    // Adjust this "input" shape to what your workflow expects.
    // Here we send the whole form plus a source tag.
    const body = {
      input: {
        source: "roadrehab-web-form",
        form,
      },
    };

    const apiRes = await fetch(
      `https://api.openai.com/v1/workflows/${WORKFLOW_ID}/runs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "workflows=v1",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await apiRes.text();
    let json: unknown;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = text;
    }

    if (!apiRes.ok) {
      console.error("Workflow call failed:", apiRes.status, json);
      return NextResponse.json(
        {
          error: true,
          status: apiRes.status,
          details: json || "Workflow call failed",
        },
        { status: 500 }
      );
    }

    console.log("Workflow success:", json);
    return NextResponse.json(json);
  } catch (err) {
    console.error("API route error in /api/roadrehab:", err);
    const message = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}
