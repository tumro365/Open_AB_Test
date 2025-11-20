/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const WORKFLOW_ID = process.env.ROADREHAB_WORKFLOW_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!WORKFLOW_ID || !OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing ROADREHAB_WORKFLOW_ID or OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const { form } = await req.json();

    // Your workflow currently expects a single string input called "input_as_text".
    // We send the form JSON as a string into that variable.
    const body = {
      input: {
        input_as_text: JSON.stringify(form),
      },
    };

    const res = await fetch(`https://api.openai.com/v1/workflows/${WORKFLOW_ID}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "workflows=v1",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Workflow error", text);
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();

    // For now, just pass the whole workflow response straight back.
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
