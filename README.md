# magpie-amd-auth

AMD Radeon Cloud provider plugin for Magpie. OpenAI-compatible `/v1` — the loader
just hands the OpenAI SDK a baseURL + apiKey, no SSE translation.

## Models (12, from AMD /v1/models)

Clef, d3, d3-flash, DeepSeek-V4.1-Flash, DeepSeek-V4-Flash, Gemma-4-31B-IT,
GLM-5.3-Flash, MiMo-V2.6-Flash, MiniCPM5-2B, MiniCPM-V-4.7-1B,
MiniCPM-V-4.7-35B-A3B, Qwen3.8-27B

## Install

```sh
magpie n github:ddfc1991/magpie-amd-auth
```

Then sign in to **AMD Radeon** (provider card → sign in → paste your AMD API key).

## Sign-in

The provider takes an AMD **API key** (`rc-` + 48 hex) from
developer.amd.com.cn → Token Factory. Requests are sent with
`Authorization: Bearer <key>` to `https://developer.amd.com.cn/radeon/api/v1`.

No secrets are stored in this repo.
