import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

export async function POST(req: NextRequest) {
  try {
    const { rawText, resume } = await req.json();

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume text for ATS compatibility issues and return a JSON report.

Resume text (first 3000 chars):
${(rawText || "").slice(0, 3000)}

Structured data extracted:
- Skills count: ${(resume?.skills?.languages?.length || 0) + (resume?.skills?.frameworksAndTools?.length || 0)}
- Experience entries: ${resume?.experience?.length || 0}
- Has summary: ${resume?.summary ? "yes" : "no"}
- Education entries: ${resume?.education?.length || 0}

Check for these ATS red flags:
1. Missing contact info (email, phone)
2. Weak or missing summary/objective
3. No quantified achievements (missing numbers/metrics in bullets)
4. Too few or too many skills listed
5. Vague job titles
6. Missing dates on experience
7. Short bullet points with no impact
8. Keyword density (too sparse or stuffed)

Return ONLY this JSON:
{
  "score": <0-100 ATS compatibility score>,
  "issues": [
    {
      "type": "<issue category>",
      "description": "<specific issue found>",
      "severity": "<high|medium|low>"
    }
  ],
  "suggestions": ["<actionable fix 1>", "<actionable fix 2>", "<actionable fix 3>"],
  "verdict": "<one sentence overall assessment>"
}`;

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: "You are an ATS expert. Return only valid JSON." },
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
      { msg: "Failed to run ATS check", details: (error as Error).message },
      { status: 500 },
    );
  }
}
