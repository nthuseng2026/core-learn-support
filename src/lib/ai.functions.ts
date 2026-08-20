import { createServerFn } from "@tanstack/react-start";
import { AssistantInput, GenerateInput, INSTRUCTIONS, ASSISTANT_SYSTEM_SUFFIX } from "./ai.prompts";
import { RESPONSIBLE_SYSTEM, chat } from "./ai.server";

export const generateAiContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const content = await chat([
      { role: "system", content: RESPONSIBLE_SYSTEM },
      { role: "user", content: `${INSTRUCTIONS[data.kind]}\n\n---\n${data.details}` },
    ]);
    return { content };
  });

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssistantInput.parse(input))
  .handler(async ({ data }) => {
    const content = await chat([
      {
        role: "system",
        content: `${RESPONSIBLE_SYSTEM}\n\n${ASSISTANT_SYSTEM_SUFFIX}`,
      },
      ...data.messages,
    ]);
    return { content };
  });