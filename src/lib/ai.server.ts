const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

export const RESPONSIBLE_SYSTEM = `You are an assistant supporting a qualified Foundation Phase educator and learning-support practitioner in South Africa ("Nthuseng Learning Room").

Hard rules:
- Never diagnose disabilities, medical, developmental or psychological conditions. Never use words like disorder, dyslexia, ADHD, deficit, defective or abnormal.
- Use tentative, strengths-based, professional language: "The information suggests...", "An area that may benefit from additional support is...", "Consider monitoring...", "Suggested learning focus...".
- Keep professional judgement with the educator. Be practical, warm and concise.
- Write in plain prose with short labelled sections and plain-text headings. No markdown symbols like ** or #.
- Suggest low-cost or recycled materials where relevant.`;

export async function chat(messages: { role: string; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("The AI assistant is busy right now. Please try again in a moment.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted for this workspace. Please add credits to continue.");
    if (res.status === 403) throw new Error("AI access is currently blocked for this workspace.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("The AI returned an empty response. Please try again.");
  return content;
}