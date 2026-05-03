import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

export async function POST(req: NextRequest) {
  try {
    const { resume } = await req.json();

    const context = `
Name: ${resume.personalInfo?.name}
Current Title: ${resume.personalInfo?.title}
Top Skills: ${[...(resume.skills?.languages || []), ...(resume.skills?.frameworksAndTools || [])].slice(0, 8).join(", ")}
Experience: ${(resume.experience || []).slice(0, 2).map((e: { position: string; company: string }) => `${e.position} at ${e.company}`).join(", ")}
`.trim();

    const prompt = `Generate 5 short, punchy professional headline/taglines for this person's portfolio website.

Background:
${context}

Rules:
- Each tagline must be under 10 words
- Be specific to their actual background — no generic phrases
- Vary the style: some action-oriented, some identity-based, some achievement-based
- No buzzwords like "passionate", "ninja", "guru", "rockstar"
- No quotes around the taglines

Return ONLY this JSON:
{
  "taglines": ["tagline 1", "tagline 2", "tagline 3", "tagline 4", "tagline 5"]
}`;

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: "You are a professional copywriter. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        stream: false,
        format: "json",
      }),
    });

    const data = await response.json();
    const parsed = JSON.parse(data.message?.content?.trim() || "{}");
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { msg: "Failed to generate taglines", details: (error as Error).message },
      { status: 500 },
    );
  }
}
