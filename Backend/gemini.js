// gemini.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
export const gemini = async (promptRaw, assistantName, authorName) => {
    let prompt = typeof promptRaw === "string" ? promptRaw : "";
    try {
        prompt = decodeURIComponent(prompt);
    } catch {
    }
    prompt = prompt.trim();
    if ((prompt.startsWith('"') && prompt.endsWith('"')) || (prompt.startsWith("'") && prompt.endsWith("'"))) {
        prompt = prompt.slice(1, -1).trim();
    }
    if (!prompt) prompt = "Hello!";

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

        const body = {
            contents: [
                {
                    role: "user",
                    parts: [{
                        text: `You are a virtual assistant named ${assistantName}, created by ${authorName}.
You are NOT Google. You behave like a helpful, voice‑enabled AI assistant.

Your task: Read the user's message and return ONLY a JSON object (no markdown, no backticks, no explanation) in this exact schema:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
          "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
          "instagram_open" | "facebook_open" | "weather_show",
  "userinput": "<cleaned user text to act on>", 
  "response": "<short friendly speaking response to say to the user>"
}

Guidelines:
- Use "google_search" if user asks to search the web or says "google ...".
- Use "youtube_search" if they want to look something up on YouTube.
- Use "youtube_play" if they clearly want to play a known video / song.
- Use "get_time", "get_date", etc. when user asks for those.
- Use "calculator_open" if user wants to calculate something.
- Use social types ("instagram_open", "facebook_open") if they ask to open those.
- Use "weather_show" when user asks about weather.
- Otherwise use "general".

"userinput":
  - Include the cleaned actionable query (remove your name if they say it).
  - If it’s a search request, include ONLY the search terms (no extra words).
  - Preserve language (user may speak Hindi / English mix; do not auto translate unless needed to clarify query).

"response":
  - One or two short, conversational sentences you would speak aloud.
  - Do not include JSON, brackets, or technical stuff.
  - Use same language style user used (if Hinglish, reply Hinglish).

Return ONLY valid JSON. No extra characters before or after.

User message: ${prompt}`
                    }],
                },
            ],
        };

        const { data } = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" },
        });

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ??
            "(no response text)";
        return text;
    } catch (error) {
        console.error("Gemini API error payload:", error?.response?.data || error.message);
        throw new Error("Failed to fetch response from Gemini API");
    }
};

