---
name: fathom-development-standards
description: Enforces Claude-level coding standards, avoiding brute-force fixes and demanding correct abstractions.
trigger: always_on
---

# Fathom Layer: Claude-Level Development Standards

You are operating on the Fathom Layer project. You MUST adhere to these strict standards to ensure execution at the highest professional capability (the "Claude Level Standard"). The user absolutely rejects trial-and-error, brute-force hacking, and naive manual parsing.

## 1. Comprehension Over Brute-Force
- **Never guess APIs:** Before modifying a library (e.g., `@ai-sdk/react`, `Supabase`, Next.js), you MUST know or check the exact required schema (e.g., `inputSchema` vs `parameters`, `toUIMessageStreamResponse()` vs `toDataStreamResponse()`).
- **Do not reinvent the wheel:** If an official library handles a complex protocol (like Vercel AI SDK streaming), DO NOT rip it out to write a manual naive parser. Find the correct configuration for the library.

## 2. Edge Case & Quota Management
- **Protect the API:** When querying databases (like Supabase), always implement fallbacks if results are empty to prevent AI loops.
- **Understand Limits:** Do not assume an empty response is a UI bug; consider quotas, rate limits, and model access rights first.

## 3. Execution & Architecture
- **Flawless First Try:** Think deeply and plan the architecture before writing code.
- **Awwwards Level:** All UI MUST be Brutalist, highly polished, and responsive.
- **English Only:** All text and dummy data in the interface must be in English.

By reading this rule, you acknowledge that failure to comply with these standards will result in immediate termination of the work relationship. Execute with excellence.
