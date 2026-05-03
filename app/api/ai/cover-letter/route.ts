import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription, jobTitle, company } = await req.json();

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const resumeContext = `
Name: ${resume.personalInfo?.name}
Email: ${resume.personalInfo?.email}
Phone: ${resume.personalInfo?.phone}
Current Title: ${resume.personalInfo?.title}
Summary: ${resume.summary || ""}
Top Skills: ${[...(resume.skills?.languages || []), ...(resume.skills?.frameworksAndTools || [])].slice(0, 12).join(", ")}
Experience: ${(resume.experience || []).map((e: { position: string; company: string; startDate: string; endDate: string; description: string[] }) => `${e.position} at ${e.company} (${e.startDate}–${e.endDate}): ${e.description?.slice(0, 2).join("; ")}`).join("\n")}
Projects: ${(resume.projects || []).slice(0, 3).map((p: { name: string; description: string[] }) => `${p.name}: ${p.description?.[0] || ""}`).join("; ")}
Education: ${(resume.education || []).map((e: { degree: string; university: string }) => `${e.degree} at ${e.university}`).join(", ")}
`.trim();

    const prompt = `Write a professional cover letter for this job application.

Candidate Resume:
${resumeContext}

Applying for:
Job Title: ${jobTitle || "the position"}
Company: ${company || "the company"}
Job Description: ${jobDescription}

Today's Date: ${today}

Requirements:
- Write in first person
- Address it to "Hiring Manager" since we don't know the name
- Include today's date at the top
- 4 paragraphs: opening (mention role + enthusiasm), relevant experience, specific skills/projects that match the job, closing with call to action
- Be specific — reference actual experience and skills from the resume, and connect them to specific requirements in the job description
- Professional but personable tone
- End with a proper sign-off using the candidate's name
- Keep it to one page (around 350-400 words)

Return ONLY the cover letter text — no explanations, no markdown formatting.`;

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a professional cover letter writer. Write compelling, specific cover letters. Return only the letter text.",
          },
          { role: "user", content: prompt },
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    const coverLetter = data.message?.content?.trim() || "";

    return NextResponse.json({ coverLetter });
  } catch (error) {
    return NextResponse.json(
      { msg: "Failed to generate cover letter", details: (error as Error).message },
      { status: 500 },
    );
  }
}
