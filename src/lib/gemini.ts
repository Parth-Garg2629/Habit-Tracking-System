import { z } from "zod";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Zod schema for validating Gemini's structured response
export const aiAnalysisSchema = z.object({
  detectedSkills: z.array(z.object({
    name: z.string(),
    category: z.enum(["language", "framework", "tool", "concept", "soft_skill", "other"]),
    confidence: z.number().min(0).max(1),
    xpSuggested: z.number().min(5).max(100),
    reasoning: z.string(),
  })),
  totalXpSuggested: z.number().min(5).max(500),
  summary: z.string(),
  encouragement: z.string(),
});

export type AiAnalysisResult = z.infer<typeof aiAnalysisSchema>;

export async function analyzeWithGemini(content: string, duration: number | null, existingSkills: string[]): Promise<AiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = buildPrompt(content, duration, existingSkills);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            detectedSkills: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  category: { type: "STRING", enum: ["language", "framework", "tool", "concept", "soft_skill", "other"] },
                  confidence: { type: "NUMBER" },
                  xpSuggested: { type: "INTEGER" },
                  reasoning: { type: "STRING" },
                },
                required: ["name", "category", "confidence", "xpSuggested", "reasoning"],
              },
            },
            totalXpSuggested: { type: "INTEGER" },
            summary: { type: "STRING" },
            encouragement: { type: "STRING" },
          },
          required: ["detectedSkills", "totalXpSuggested", "summary", "encouragement"],
        },
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response from Gemini API");
  }

  const parsed = JSON.parse(text);
  const validated = aiAnalysisSchema.parse(parsed);

  return validated;
}

function buildPrompt(content: string, duration: number | null, existingSkills: string[]): string {
  const durationInfo = duration ? `\nStudy duration: ${duration} minutes.` : "";
  const skillsInfo = existingSkills.length > 0
    ? `\nUser's existing tracked skills: ${existingSkills.join(", ")}.\nPrefer matching to these existing skills when appropriate, but also detect new ones.`
    : "\nThe user has no tracked skills yet. Detect all relevant skills from the content.";

  return `You are an AI tutor analyzing a learning log entry for a personal growth tracking application.

Analyze the following learning log and provide a structured assessment.

## Learning Log Content
${content}${durationInfo}${skillsInfo}

## Instructions
1. Detect all skills practiced or learned in this log entry.
2. For each skill, provide:
   - name: A clear, concise skill name (e.g., "TypeScript", "React Hooks", "System Design", "Problem Solving")
   - category: One of "language", "framework", "tool", "concept", "soft_skill", or "other"
   - confidence: A float 0-1 indicating how confident you are this skill was practiced (0.5+ means clearly mentioned)
   - xpSuggested: XP reward for this skill based on depth/effort (5-100 range, 5=mentioned, 25=practiced, 50=deep work, 100=breakthrough)
   - reasoning: Brief explanation of why this skill was detected and the XP amount
3. Calculate totalXpSuggested as the sum of all skill XP values, capped at 500.
4. Write a brief 1-2 sentence summary of what was learned.
5. Write a brief encouraging message to motivate the user.

## XP Guidelines
- Merely mentioning a topic: 5-10 XP
- Actively practicing/coding: 15-30 XP
- Deep problem-solving or debugging: 30-50 XP
- Building something substantial: 40-70 XP
- Breakthrough understanding or teaching others: 60-100 XP
- Duration bonus: If study time > 60 minutes, scale up slightly.
- Keep totalXpSuggested reasonable: typical entry should be 20-80 XP total.

Return valid JSON matching the schema exactly.`;
}
