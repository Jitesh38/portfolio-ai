import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

export async function POST(req: NextRequest) {
  try {
    const { resume } = await req.json();

    const context = `
Name: ${resume.personalInfo?.name || ""}
Title: ${resume.personalInfo?.title || ""}
Experience: ${(resume.experience || []).map((e: { position: string; company: string; startDate: string; endDate: string }) => `${e.position} at ${e.company} (${e.startDate}–${e.endDate})`).join("; ")}
Skills: ${[...(resume.skills?.languages || []), ...(resume.skills?.frameworksAndTools || [])].slice(0, 12).join(", ")}
Projects: ${(resume.projects || []).slice(0, 3).map((p: { name: string }) => p.name).join(", ")}
`.trim();

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert career coach and copywriter. Write concise, compelling professional bios. Return ONLY the bio text — no quotes, no labels, no thinking.",
          },
          {
            role: "user",
            content: `Write a 2-3 sentence first-person professional summary for a portfolio website based on this background:\n\n${context}\n\nBe specific and confident. Highlight impact, not just responsibilities.`,
          },
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    const summary = data.message?.content?.trim() || "";

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { msg: "Failed to generate summary", details: (error as Error).message },
      { status: 500 },
    );
  }
}
