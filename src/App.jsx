import { useState, useRef } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;

const MODELS = [
  {
    id: "gpt4",
    name: "GPT-4o",
    company: "OpenAI",
    color: "#10a37f",
    persona: `Answer the user's question in a style inspired by GPT-4o: precise, well-structured, slightly formal, thorough. Use clear sections or bullet points where helpful. Be comprehensive but not verbose. Keep it to 150-200 words.`,
  },
  {
    id: "gemini",
    name: "Gemini 1.5",
    company: "Google",
    color: "#4285f4",
    persona: `Answer the user's question in a style inspired by Gemini 1.5 Pro: conversational yet knowledgeable, optimistic, concise but complete. Highlight connections between ideas. Keep it to 150-200 words.`,
  },
  {
    id: "claude",
    name: "Claude 3.5",
    company: "Anthropic",
    color: "#cc785c",
    persona: `Answer the user's question in a thoughtful, nuanced style: be honest about uncertainty, warm but direct. Focus on being genuinely helpful rather than just comprehensive. Keep it to 150-200 words.`,
  },
  {
    id: "llama",
    name: "Llama 3.1",
    company: "Meta",
    color: "#0866ff",
    persona: `Answer the user's question in a style inspired by open-source LLMs like Llama: direct, practical, slightly technical. Emphasize accessible and clear explanations. Avoid fluff. Keep it to 150-200 words.`,
  },
  {
    id: "mistral",
    name: "Mistral Large",
    company: "Mistral AI",
    color: "#ff7000",
    persona: `Answer the user's question in a style inspired by Mistral: maximally efficient, technically sharp, no filler. Get straight to the point with precise reasoning. Keep it to 150-200 words.`,
  },
  {
    id: "zidian",
    name: "Zidian",
    company: "Nova Technology",
    color: "#00c9a7",
    persona: `Answer the user's question in a style inspired by Zidian by Nova Technology: analytical, data-driven, and precise. Draw on structured reasoning and present information with clarity and depth. Keep it to 150-200 words.`,
  },
];

async function queryModel(model, userQuery) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: model.persona,
      messages: [{ role: "user", content: userQuery }],
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const reason = data?.error?.message || `HTTP ${response.status}`;
    throw new Error(reason);
  }
  return data.content?.[0]?.text || "Risposta vuota dal server.";
}

function TypingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "8px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: color,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function ModelCard({ model, response, loading, error }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${model.color}33`,
      borderRadius: 16, padding: "24px",
      display: "flex", flexDirection: "column", gap: 16,
      boxShadow: response ? `0 0 30px ${model.color}15` : "none",
      minHeight: 200,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${model.color}20`, border: `1.5px solid ${model.color}60`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 700, color: model.color, fontFamily: "'Space Mono', monospace",
        }}>
          {model.name[0]}
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{model.name}</div>
          <div style={{ color: model.color, fontSize: 12, fontFamily: "'Space Mono', monospace", opacity: 0.8 }}>{model.company}</div>
        </div>
        {response && <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: model.color, boxShadow: `0 0 8px ${model.color}` }} />}
      </div>
      <div style={{ flex: 1 }}>
        {loading && <TypingDots color={model.color} />}
        {error && <div style={{ color: "#ff6b6b", fontSize: 13 }}>⚠ {error}</div>}
        {response && !loading && (
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {response}
          </div>
        )}
        {!response && !loading && !error && (
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>In attesa della query...</div>
        )}
      </div>
    </div>
  );
}

export default function LLMComparator() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [hasQueried, setHasQueried] = useState(false);
  const textareaRef = useRef(null);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setHasQueried(true);
    setResponses({});
    setErrors({});
    const newLoading = {};
    MODELS.forEach((m) => (newLoading[m.id] = true));
    setLoading(newLoading);

    (async () => {
      for (const model of MODELS) {
        try {
          const result = await queryModel(model, query);
          setResponses((prev) => ({ ...prev, [model.id]: result }));
        } catch (e) {
          setErrors((prev) => ({ ...prev, [model.id]: e.message }));
        } finally {
          setLoading((prev) => ({ ...prev, [model.id]: false }));
        }
      }
    })();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleQuery();
  };

  const allDone = hasQueried && MODELS.every((m) => !loading[m.id]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      <div style={{ padding: "48px 32px 32px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, margin: 0, letterSpacing: "-1.5px", background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          LLM Comparator
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", marginTop: 10, fontSize: 15 }}>
          Fai una domanda e confronta le risposte dei principali modelli AI
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto 48px", padding: "0 24px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Es: Qual è la differenza tra machine learning e deep learning?"
            rows={3}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 15, lineHeight: 1.6, resize: "none", fontFamily: "'DM Sans', sans-serif" }}
          />
          <button
            onClick={handleQuery}
            disabled={!query.trim() || Object.values(loading).some(Boolean)}
            style={{ background: query.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, width: 48, height: 48, cursor: query.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, textAlign: "right", marginTop: 8, fontFamily: "'Space Mono', monospace" }}>⌘ + Enter per inviare</p>
      </div>

      {hasQueried && (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, animation: "fadeIn 0.4s ease" }}>
          {MODELS.map((model) => (
            <ModelCard key={model.id} model={model} response={responses[model.id]} loading={loading[model.id]} error={errors[model.id]} />
          ))}
        </div>
      )}

      {allDone && (
        <div style={{ maxWidth: 720, margin: "32px auto 0", padding: "0 24px", animation: "fadeIn 0.5s ease" }}>
          <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: "14px 20px", textAlign: "center", color: "rgba(74,222,128,0.8)", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>
            ✓ Tutti i modelli hanno risposto — fai una nuova domanda per confrontare
          </div>
        </div>
      )}
    </div>
  );
}