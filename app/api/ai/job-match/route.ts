import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription } = await req.json();

    const resumeSummary = `
Name: ${resume.personalInfo?.name}
Title: ${resume.personalInfo?.title}
Skills: ${[...(resume.skills?.languages || []), ...(resume.skills?.frameworksAndTools || [])].join(", ")}
Experience: ${(resume.experience || []).map((e: { position: string; company: string; description: string[] }) => `${e.position} at ${e.company}: ${e.description?.slice(0, 2).join("; ")}`).join(" | ")}
Projects: ${(resume.projects || []).map((p: { name: string; technologies: string[] }) => `${p.name} (${p.technologies?.join(", ")})`).join(", ")}
`.trim();

    const prompt = `You are a technical recruiter. Compare this candidate's resume against the job description and return a JSON analysis.

RESUME:
${resumeSummary}

JOB DESCRIPTION:
${jobDescription}

Return ONLY this JSON:
{
  "score": <0-100 match percentage>,
  "matchingSkills": ["<skill that matches>"],
  "missingSkills": ["<skill required but missing>"],
  "strengths": ["<strength relevant to this role>"],
  "gaps": ["<gap that would hurt their application>"],
  "recommendation": "<2 sentence honest assessment and advice>"
}`;

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: "You are a technical recruiter. Return only valid JSON." },
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
      { msg: "Failed to analyze job match", details: (error as Error).message },
      { status: 500 },
    );
  }
}
