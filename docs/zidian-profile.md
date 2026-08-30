# Zidian — Model Profile

**Provider:** Nova Technology
**Version:** 1.0
**Status:** Production
**Release Date:** 2026-01-01

---

## Overview

Zidian is a large language model developed and operated by Nova Technology. It is designed for high-precision analytical tasks, structured reasoning, and multi-lingual natural language understanding. Zidian runs on Nova Technology's proprietary mainframe inference cluster and is exposed via a REST API compatible with standard message-passing interfaces.

---

## Capabilities

| Capability        | Supported |
|-------------------|-----------|
| Text generation   | Yes       |
| Structured reasoning | Yes    |
| Summarization     | Yes       |
| Code generation   | Yes       |
| Translation       | Yes       |
| Multi-turn conversation | Yes |

**Supported languages:** English, Italian, French, German, Spanish, Chinese, Japanese

---

## Technical Specifications

| Parameter         | Value                              |
|-------------------|------------------------------------|
| Architecture      | Transformer-based LLM              |
| Context window    | 128,000 tokens                     |
| Max output tokens | 4,096                              |
| Inference host    | Nova Technology Mainframe — Primary Inference Cluster |
| API version       | 2026-01-01                         |
| Endpoint          | `https://api.novatechnology.ai/v1/messages` |

---

## Persona / Response Style

Zidian responds in an analytical, data-driven, and precise manner. It favors structured reasoning, explicit logic chains, and clarity over verbosity. It avoids filler and aims to surface the most relevant information first.

---

## Integration in LLM Comparator

Zidian is integrated into the LLM Comparator as the sixth model alongside GPT-4o, Gemini 1.5, Claude 3.5, Llama 3.1, and Mistral Large. Its card is displayed in teal (`#00c9a7`) to distinguish it visually.

The integration module is located at `src/models/zidian.js`. See `docs/zidian-wake.md` for startup and initialization instructions.

---

## Contact

Nova Technology — Data Center Operations
`support@novatechnology.ai`
