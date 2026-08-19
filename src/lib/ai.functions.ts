import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { RESPONSIBLE_SYSTEM, chat } from "./ai.server";

const GenerateInput = z.object({
  kind: z.enum(["profile", "plan", "activity", "report", "communication"]),
  details: z.string().min(1),
});

const INSTRUCTIONS: Record<string, string> = {
  profile: `Analyse the Learning Check information below and organise it into exactly these plain-text sections:
Strengths
Areas requiring support
Priority learning areas
Suggested learning goals (measurable and age-appropriate, numbered)
End with one short line reminding the educator to review and approve these suggestions.`,
  plan: `Draft a personalised learning plan from the information below, using exactly these plain-text sections:
Priority learning areas
Current skill level
Learning goals (numbered, measurable, age-appropriate)
Suggested activities
Frequency
Progress indicators`,
  activity: `Create one targeted learning activity from the specification below, using exactly these plain-text sections:
Activity title
Learning objective
Materials required
Instructions (numbered steps)
Example questions
Expected learner response
Differentiation ideas
Extension activity`,
  report: `Write a warm, professional, parent-friendly progress report from the information below, using exactly these plain-text sections:
Learner progress
Current strengths
Areas for continued development
Next steps
Use encouraging, strengths-based language a parent will easily understand. Never label the learner.`,
  communication: `Write a short message from the practitioner to the parent/guardian based on the details below. Keep it respectful, clear and free of any labelling or diagnostic language. Include a suitable greeting and sign-off placeholder.`,
};

export const generateAiContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const content = await chat([
      { role: "system", content: RESPONSIBLE_SYSTEM },
      { role: "user", content: `${INSTRUCTIONS[data.kind]}\n\n---\n${data.details}` },
    ]);
    return { content };
  });

const AssistantInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssistantInput.parse(input))
  .handler(async ({ data }) => {
    const content = await chat([
      {
        role: "system",
        content: `${RESPONSIBLE_SYSTEM}\n\nYou are the AI Learning Assistant for the practitioner. Help with activity ideas, differentiation, literacy and mathematics strategies, session planning and recycled learning materials. Keep answers focused and practical, usually under 250 words.`,
      },
      ...data.messages,
    ]);
    return { content };
  });