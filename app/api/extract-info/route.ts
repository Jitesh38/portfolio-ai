import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

export async function POST(req: NextRequest) {
  console.log("[extract-info] POST request received");
  console.log(`[extract-info] Using Ollama at: ${OLLAMA_URL}, model: ${OLLAMA_MODEL}`);

  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      console.error("[extract-info] No text provided in request body. Keys:", Object.keys(body));
      return NextResponse.json(
        { msg: "No text provided in request body" },
        { status: 400 },
      );
    }

    console.log(`[extract-info] Input text length: ${text.length} chars`);

    const prompt = `
Convert the following resume text into valid structured JSON.

Return ONLY JSON (no markdown, no explanation).

IMPORTANT skill extraction rules:
- "languages": programming/scripting languages only (e.g. Python, JavaScript, TypeScript, Java, C++)
- "frameworksAndTools": frameworks, libraries, tools, platforms, databases, cloud services (e.g. React, Node.js, Docker, AWS, PostgreSQL, Git)
- "softSkills": interpersonal/professional skills (e.g. Leadership, Communication)
- Also INFER skills from job descriptions and project descriptions — if someone built a React app, add React; if they used AWS at work, add AWS. Do not only list explicitly stated skills.
- Deduplicate across categories. A skill should appear in only one category.

Schema:
{
  "personalInfo": {
    "name": "string",
    "title": "string",
    "location": "string",
    "phone": "string",
    "email": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string",
  },
  "summary": "string",
  "skills": {
    "languages": ["string"],
    "frameworksAndTools": ["string"],
    "libraries": ["string"],
    "softSkills": ["string"]
  },
  "experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "isCurrentRole": "boolean",
      "description": ["string"],
      "technologies": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "link": "string | null",
      "description": ["string"],
      "technologies": ["string"]
    }
  ],
  "education": [
    {
      "university": "string",
      "degree": "string",
      "branch": "string",
      "location": "string",
      "sgpa": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "extracurricular": ["string"],
  "customSections": [
    {
      "title": "string",
      "items": ["string"]
    }
  ]
}

Resume Text:
${text}
`;

    const ollamaPayload = {
      model: OLLAMA_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a resume parser that outputs only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
      format: "json",
    };

    const ollamaEndpoint = `${OLLAMA_URL}/api/chat`;
    console.log(`[extract-info] Calling Ollama: ${ollamaEndpoint}`);
    console.log(`[extract-info] Payload model: ${ollamaPayload.model}, stream: ${ollamaPayload.stream}`);

    let response: Response;
    try {
      response = await fetch(ollamaEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ollamaPayload),
      });
    } catch (fetchError) {
      console.error("[extract-info] Fetch to Ollama FAILED (network error):", fetchError);
      console.error("[extract-info] Is Ollama running? Check: curl", ollamaEndpoint);
      return NextResponse.json(
        {
          msg: "Cannot connect to Ollama",
          details: (fetchError as Error).message,
          hint: `Make sure Ollama is running at ${OLLAMA_URL}`,
        },
        { status: 502 },
      );
    }

    console.log(`[extract-info] Ollama response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[extract-info] Ollama returned error:", response.status, errorBody);
      return NextResponse.json(
        { msg: "Ollama returned an error", status: response.status, details: errorBody },
        { status: 500 },
      );
    }

    const data = await response.json();
    console.log("[extract-info] Ollama response keys:", Object.keys(data));
    console.log("[extract-info] Ollama message role:", data.message?.role);
    console.log("[extract-info] Ollama content length:", data.message?.content?.length ?? "NO CONTENT");

    const raw = data.message?.content;

    if (!raw) {
      console.error("[extract-info] No content in Ollama response. Full response:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { msg: "Ollama returned empty content", details: data },
        { status: 500 },
      );
    }

    console.log("[extract-info] Raw content (first 500 chars):", raw.substring(0, 500));

    let parsedJSON;
    try {
      parsedJSON = JSON.parse(raw);
    } catch (parseError) {
      console.error("[extract-info] JSON.parse FAILED on Ollama output:", (parseError as Error).message);
      console.error("[extract-info] Raw output was:", raw);
      return NextResponse.json(
        {
          msg: "Ollama returned invalid JSON",
          details: (parseError as Error).message,
          raw: raw.substring(0, 1000),
        },
        { status: 500 },
      );
    }

    console.log("[extract-info] Successfully parsed JSON. Top-level keys:", Object.keys(parsedJSON));
    return NextResponse.json(parsedJSON);
  } catch (error) {
    console.error("[extract-info] UNHANDLED ERROR:", error);
    console.error("[extract-info] Error name:", (error as Error).name);
    console.error("[extract-info] Error message:", (error as Error).message);
    console.error("[extract-info] Error stack:", (error as Error).stack);
    return NextResponse.json(
      { msg: "Failed to parse PDF", details: (error as Error).message },
      { status: 500 },
    );
  }
}
