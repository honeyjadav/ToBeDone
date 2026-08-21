import Groq from "groq-sdk"; // npm i groq-sdk

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SOURCE_MAP = {
  Task: "Task",
  Message: "Chat",
  FileUpload: "Webhook",
  Membership: "Chat",
  Board: "Task",
};

// Strip fields we never want the model to see (raw ObjectIds), keep only
// human-readable substitutes (e.g. assignedToNames instead of assignedTo).
const sanitizeMetadata = (metadata = {}) => {
  const { assignedTo, ...rest } = metadata;
  return rest;
};

export const summarizeActivity = async (logs) => {
  if (!logs.length) {
    return { groups: [], focus: "No new activity in this period." };
  }

  const compact = logs.map((l) => ({
    action: l.action,
    source: SOURCE_MAP[l.targetType] || "Task",
    user: l.user?.name || "Someone",
    metadata: sanitizeMetadata(l.metadata),
    at: l.createdAt,
  }));

  const prompt = `You are summarizing workspace activity logs into a digest.
Return ONLY valid JSON, no markdown, no preamble, in this exact shape:
{
  "groups": [
    { "title": string, "source": "Task" | "Chat" | "Webhook", "items": string[] }
  ],
  "focus": string
}
Group related items together, write items as short human-readable sentences,
and "focus" should be one actionable suggestion based on the most important item.
Never include raw database IDs in the output — always refer to people by the
names provided in metadata (e.g. assignedToNames), never by any id field.

Activity logs:
${JSON.stringify(compact)}`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content;
  return JSON.parse(raw);
};