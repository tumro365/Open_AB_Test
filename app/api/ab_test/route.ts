import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const workflowId = process.env.ROADREHAB_WORKFLOW_ID;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!workflowId) {
      return NextResponse.json(
        { error: true, message: "Missing ROADREHAB_WORKFLOW_ID env variable" },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: true, message: "Missing OPENAI_API_KEY env variable" },
        { status: 500 }
      );
    }

    // WORKFLOW RUN REQUEST (CORRECT ENDPOINT)
    const response = await fetch(`https://api.openai.com/v1/workflows/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        input: body, // send the form itself
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: true, details: result },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: true, message: err.message },
      { status: 500 }
    );
  }
}
