/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Widget } from "@openai/widget-react";
import widgetDefinition from "../roadrehab-widget.json";

export default function Home() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <Widget
        widget={widgetDefinition}
        onSubmit={async (formData) => {
          // This is where you send the form data to your agent workflow
          const response = await fetch("/api/run-workflow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const result = await response.json();
          return result; // this is what shows up back in the UI
        }}
      />
    </div>
  );
}

