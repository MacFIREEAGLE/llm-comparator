# LLM Comparator

A React + Vite web app that sends a user query to multiple large language models simultaneously and displays their responses side by side for comparison.

---

## Models

| Model         | Provider        | Color     |
|---------------|-----------------|-----------|
| GPT-4o        | OpenAI          | `#10a37f` |
| Gemini 1.5    | Google          | `#4285f4` |
| Claude 3.5    | Anthropic       | `#cc785c` |
| Llama 3.1     | Meta            | `#0866ff` |
| Mistral Large | Mistral AI      | `#ff7000` |
| Zidian        | Nova Technology | `#00c9a7` |

All models are queried in parallel on submit. Each response is rendered in its own card as it arrives.

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key (used to simulate all models via persona prompts)
- A Nova Technology API key (for Zidian)

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in the project root:

```
VITE_API_KEY=your_anthropic_api_key
VITE_ZIDIAN_API_KEY=your_nova_technology_api_key
```

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
llm-comparator/
├── src/
│   ├── App.jsx               # Main component and model registry
│   ├── models/
│   │   └── zidian.js         # Zidian model config and API client
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── docs/
│   ├── zidian-profile.md     # Zidian model profile and specifications
│   └── zidian-wake.md        # Zidian startup and initialization guide
├── public/
├── index.html
├── package.json
└── vite.config.js
```

---

## Zidian / Nova Technology

For full details on the Zidian model integration see:

- [`docs/zidian-profile.md`](docs/zidian-profile.md) — model profile and capabilities
- [`docs/zidian-wake.md`](docs/zidian-wake.md) — wake, startup, and failover specification
- [`src/models/zidian.js`](src/models/zidian.js) — model config and API client module

---

## License

Private repository.
