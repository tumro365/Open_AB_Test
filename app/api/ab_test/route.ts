import { NextRequest, NextResponse } from "next/server";

// Read env variables once
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ROADREHAB_WORKFLOW_ID = process.env.ROADREHAB_WORKFLOW_ID;

// Log if something is missing (helps debugging in Vercel logs)
if (!OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY env variable");
}
if (!ROADREHAB_WORKFLOW_ID) {
  console.error("❌ Missing ROADREHAB_WORKFLOW_ID env variable");
}

// Shape of the request body we expect from the frontend
interface ApiRequestBody {
  input: unknown;
}

// Shape of what we send back to the frontend
interface ApiSuccessResponse {
  success: true;
  data: unknown;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    if (!OPENAI_API_KEY || !ROADREHAB_WORKFLOW_ID) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: missing OPENAI_API_KEY or ROADREHAB_WORKFLOW_ID",
        },
        { status: 500 },
      );
    }

    const bodyJson = (await req.json()) as unknown;

    // Basic validation: we expect { input: ... }
    if (
      !bodyJson ||
      typeof bodyJson !== "object" ||
      !("input" in bodyJson)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body: expected an object with an 'input' property.",
        },
        { status: 400 },
      );
    }

    const body = bodyJson as ApiRequestBody;

    // Call the OpenAI Workflows REST API directly.
    // NOTE: Correct endpoint is /v1/workflows/runs (workflow_id goes in the body).
    const workflowResponse = await fetch("https://api.openai.com/v1/workflows/runs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "workflows=v1",
      },
      body: JSON.stringify({
        workflow_id: ROADREHAB_WORKFLOW_ID,
        inputs: {
          input_json: body.input,
        },
      }),
    });

    if (!workflowResponse.ok) {
      // Try to read error payload from OpenAI if present
      let message = `Workflow request failed with status ${workflowResponse.status}`;

      try {
        const errorJson = (await workflowResponse.json()) as {
          error?: { message?: string };
        };
        if (errorJson?.error?.message) {
          message = errorJson.error.message;
        }
      } catch {
        // ignore JSON parsing failures, keep generic message
      }

      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: workflowResponse.status },
      );
    }

    const resultJson = (await workflowResponse.json()) as unknown;

    // We just pass the full workflow JSON back for now;
    // the UI can decide how to render it.
    return NextResponse.json(
      {
        success: true,
        data: resultJson,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error calling RoadRehab workflow:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error while running workflow";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
