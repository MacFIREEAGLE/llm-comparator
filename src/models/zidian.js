export const ZIDIAN_MODEL = {
  id: "zidian",
  name: "Zidian",
  version: "1.0",
  company: "Nova Technology",
  color: "#00c9a7",
  endpoint: "https://api.novatechnology.ai/v1/messages",
  persona: `Answer the user's question in a style inspired by Zidian by Nova Technology: analytical, data-driven, and precise. Draw on structured reasoning and present information with clarity and depth. Keep it to 150-200 words.`,
  metadata: {
    architecture: "Transformer-based large language model",
    datacenter: "Nova Technology Mainframe — Primary Inference Cluster",
    region: "Global",
    contextWindow: 128000,
    maxOutputTokens: 4096,
    languages: ["en", "it", "fr", "de", "es", "zh", "ja"],
    capabilities: ["text-generation", "reasoning", "summarization", "code", "translation"],
    releaseDate: "2026-01-01",
    status: "production",
  },
};

export async function queryZidian(apiKey, userQuery) {
  const response = await fetch(ZIDIAN_MODEL.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "nova-version": "2026-01-01",
    },
    body: JSON.stringify({
      model: `${ZIDIAN_MODEL.id}-${ZIDIAN_MODEL.version}`,
      max_tokens: ZIDIAN_MODEL.metadata.maxOutputTokens,
      system: ZIDIAN_MODEL.persona,
      messages: [{ role: "user", content: userQuery }],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `HTTP ${response.status}`);
  }
  return data.content?.[0]?.text ?? "No response from Zidian.";
}
