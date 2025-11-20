/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

interface RoadRehabFormPayload {
  [key: string]: unknown;
}

const WORKFLOW_ID = process.env.ROADREHAB_WORKFLOW_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  if (!WORKFLOW_ID || !OPENAI_API_KEY) {
    return new NextResponse("Missing ROADREHAB_WORKFLOW_ID or OPENAI_API_KEY", {
      status: 500,
    });
  }

  try {
    const form: RoadRehabFormPayload = (await req.json()) as RoadRehabFormPayload;

    const body = {
      input: {
        // Adjust to match how your workflow expects inputs.
        // Here we just send the whole form as JSON text.
        form_json: form,
      },
    };

    const res = await fetch(`https://api.openai.com/v1/workflows/${WORKFLOW_ID}/runs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "workflows=v1",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Workflow error:", text);
      return new NextResponse(text || "Workflow call failed", { status: 500 });
    }

    const data: unknown = await res.json();

    // Return the full workflow response; the page will try to display "output"
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unexpected server error";
    return new NextResponse(message, { status: 500 });
  }
}
