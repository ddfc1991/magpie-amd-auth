// Magpie provider plugin: AMD Radeon Cloud (12 models via an rc- API key).
// AMD's /v1 is OpenAI-compatible, so the loader just hands the OpenAI SDK a
// baseURL + apiKey — no SSE translation needed (unlike the Runable plugin).
const PROVIDER = "amd";
const BASE = "https://developer.amd.com.cn/radeon/api/v1";
const SDK = "@ai-sdk/openai-compatible";

// Model id on AMD -> display name. Keep in sync with AMD's /v1/models catalog.
const LIMIT = { context: 128000, output: 32000 };
const MODELS = {
  "Clef": { name: "Clef" },
  "d3": { name: "D3" },
  "d3-flash": { name: "D3 Flash" },
  "DeepSeek-V4.1-Flash": { name: "DeepSeek V4.1 Flash" },
  "DeepSeek-V4-Flash": { name: "DeepSeek V4 Flash" },
  "Gemma-4-31B-IT": { name: "Gemma 4 31B IT" },
  "GLM-5.3-Flash": { name: "GLM 5.3 Flash" },
  "MiMo-V2.6-Flash": { name: "MiMo V2.6 Flash" },
  "MiniCPM5-2B": { name: "MiniCPM 5 2B" },
  "MiniCPM-V-4.7-1B": { name: "MiniCPM V 4.7 1B" },
  "MiniCPM-V-4.7-35B-A3B": { name: "MiniCPM V 4.7 35B A3B" },
  "Qwen3.8-27B": { name: "Qwen 3.8 27B" },
};

export async function AmdPlugin() {
  return {
    async config(cfg) {
      cfg.provider ??= {};
      cfg.provider[PROVIDER] ??= {
        name: "AMD Radeon",
        npm: SDK,
        api: BASE,
        models: Object.fromEntries(
          Object.entries(MODELS).map(([id, m]) => [
            id,
            {
              name: m.name,
              limit: LIMIT,
              reasoning: true,
              tool_call: true,
              modalities: { input: ["text"], output: ["text"] },
              cost: { input: 0, output: 0 },
            },
          ])
        ),
      };
    },
    auth: {
      provider: PROVIDER,
      methods: [
        {
          type: "api",
          label: "AMD API key",
          placeholder: "rc- + 48 hex from developer.amd.com.cn Token Factory",
          prompts: [
            {
              type: "password",
              key: "apiKey",
              message: "AMD API key",
              placeholder: "rc-…",
              validate: (v) => (v && v.trim() ? undefined : "Key required"),
            },
          ],
          async authorize(input, inputs) {
            const obj = input && typeof input === "object" && !Array.isArray(input) ? input : inputs || {};
            const key = ((typeof input === "string" && input.trim()) || obj.apiKey || obj.key || "").trim();
            if (!key) return { type: "failed", error: "Key required" };
            return { type: "success", key };
          },
        },
      ],
      async loader(getAuth) {
        const auth = await getAuth();
        const key = auth?.key ?? auth?.methods?.[0]?.key ?? "";
        if (!key) return {};
        return { baseURL: BASE, apiKey: key };
      },
    },
  };
}

export default AmdPlugin;
