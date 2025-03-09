import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXTAUTH_URL, // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "Acedemix", // Optional. Site title for rankings on openrouter.ai.
  },
});

export default openai;
