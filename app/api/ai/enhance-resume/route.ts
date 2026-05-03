import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

export async function POST(req: NextRequest) {
  try {
    const { resume } = await req.json();

    const prompt = `Analyze this resume and return improvement tips as JSON.

Resume data:
- Summary: ${resume.summary || "(empty)"}
- Experience (${resume.experience?.length || 0} entries): ${(resume.experience || []).slice(0, 2).map((e: { position: string; company: string; description: string[] }) => `${e.position} at ${e.company}: ${e.description?.slice(0, 2).join("; ")}`).join(" | ")}
- Projects (${resume.projects?.length || 0}): ${(resume.projects || []).map((p: { name: string }) => p.name).join(", ")}
- Skills (${(resume.skills?.languages?.length || 0) + (resume.skills?.frameworksAndTools?.length || 0)} total): ${[...(resume.skills?.languages || []), ...(resume.skills?.frameworksAndTools || [])].slice(0, 8).join(", ")}
- Education: ${(resume.education || []).map((e: { degree: string; university: string }) => `${e.degree} at ${e.university}`).join(", ") || "none"}

Return ONLY this JSON:
{
  "overallScore": <1-10>,
  "tips": [
    {
      "section": "Summary",
      "score": <1-10>,
      "issue": "<one sentence main issue>",
      "suggestions": ["<tip 1>", "<tip 2>"]
    },
    {
      "section": "Experience",
      "score": <1-10>,
      "issue": "<one sentence main issue>",
      "suggestions": ["<tip 1>", "<tip 2>"]
    },
    {
      "section": "Skills",
      "score": <1-10>,
      "issue": "<one sentence main issue>",
      "suggestions": ["<tip 1>", "<tip 2>"]
    },
    {
      "section": "Projects",
      "score": <1-10>,
      "issue": "<one sentence main issue>",
      "suggestions": ["<tip 1>", "<tip 2>"]
    }
  ]
}`;

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional resume reviewer. Return only valid JSON, no explanation.",
          },
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
      { msg: "Failed to enhance resume", details: (error as Error).message },
      { status: 500 },
    );
  }
}
