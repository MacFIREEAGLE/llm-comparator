# Zidian — Wake & Initialization Specification

This document describes the startup procedure for bringing Zidian online within the LLM Comparator application, including environment setup, API authentication, health checks, and failover behavior.

---

## Prerequisites

- A valid Nova Technology API key (`VITE_ZIDIAN_API_KEY`)
- Network access to `api.novatechnology.ai` (port 443)
- The Zidian model module at `src/models/zidian.js`

---

## Environment Variables

Add the following to your `.env` file:

```
VITE_API_KEY=<your-anthropic-key>        # used by all other models
VITE_ZIDIAN_API_KEY=<your-nova-tech-key> # dedicated key for Zidian
```

Vite exposes only variables prefixed with `VITE_` to the browser bundle. Never commit real keys.

---

## Startup Sequence

1. **Environment load** — Vite reads `.env` at build/dev time and injects `VITE_ZIDIAN_API_KEY` into the bundle.
2. **Module import** — `App.jsx` imports `ZIDIAN_MODEL` and `queryZidian` from `src/models/zidian.js`.
3. **Model registration** — `ZIDIAN_MODEL` is inserted into the `MODELS` array used to render model cards and dispatch queries.
4. **Query dispatch** — On user submit, `queryZidian` fires a POST to `https://api.novatechnology.ai/v1/messages` with the user prompt and Zidian's system persona.
5. **Response render** — The response text is stored in local React state and displayed in the Zidian `ModelCard`.

---

## Health Check

Before running the app in production, verify connectivity to the Nova Technology endpoint:

```bash
curl -X POST https://api.novatechnology.ai/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $VITE_ZIDIAN_API_KEY" \
  -H "nova-version: 2026-01-01" \
  -d '{"model":"zidian-1.0","max_tokens":16,"messages":[{"role":"user","content":"ping"}]}'
```

Expected: HTTP 200 with a `content` array containing at least one text block.

---

## Failover Behavior

If the Nova Technology API is unreachable or returns a non-200 status:

- The Zidian `ModelCard` displays a `⚠` error message with the HTTP status or error description.
- All other models continue operating independently — Zidian's failure is isolated.
- No retry logic is currently implemented; the user can resubmit the query manually.

---

## Shutdown / Disabling Zidian

To temporarily disable Zidian without removing it from the codebase, comment out its entry in the `MODELS` array in `App.jsx`:

```js
// {
//   id: "zidian",
//   name: "Zidian",
//   ...
// },
```

To fully remove it, delete `src/models/zidian.js` and its entry in `MODELS`.

---

## Mainframe Notes

Zidian's inference runs on Nova Technology's Primary Inference Cluster. No client-side GPU or local model weights are required. All computation is handled server-side at the Nova Technology data center.
