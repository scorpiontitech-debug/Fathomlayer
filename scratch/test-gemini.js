import { google } from '@ai-sdk/google';
console.log("Google module loaded.");
try {
  const model = google('gemini-2.5-pro');
  console.log("Model instantiated:", model.modelId);
} catch (e) {
  console.error("Error instantiating model:", e);
}
