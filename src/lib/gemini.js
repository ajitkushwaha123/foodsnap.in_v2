import axios from "axios";
import { Buffer } from "buffer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const keys = [
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4,
  process.env.GEMINI_API_KEY5,
  process.env.GEMINI_API_KEY6,
  process.env.GEMINI_API_KEY7,
  process.env.GEMINI_API_KEY8,
  process.env.GEMINI_API_KEY9,
  process.env.GEMINI_API_KEY10,
  process.env.GEMINI_API_KEY11,
  process.env.GEMINI_API_KEY12,
  process.env.GEMINI_API_KEY13,
  process.env.GEMINI_API_KEY14,
  process.env.GEMINI_API_KEY15,
  process.env.GEMINI_API_KEY16,
  process.env.GEMINI_API_KEY17,
  process.env.GEMINI_API_KEY18,
  process.env.GEMINI_API_KEY19,
  process.env.GEMINI_API_KEY20,
  process.env.GEMINI_API_KEY21,
  process.env.GEMINI_API_KEY22,
  process.env.GEMINI_API_KEY23,
  process.env.GEMINI_API_KEY24,
].filter(Boolean);

if (keys.length === 0) {
  throw new Error("❌ No Gemini API keys found in environment variables.");
}

export function getRandomGeminiClient() {
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return new GoogleGenerativeAI(randomKey.trim());
}

const extractValidJsonObjects = (incompleteJson) => {
  try {
    const cleaned = incompleteJson.replace(/```(?:json)?/g, "").trim();
    const matches = [...cleaned.matchAll(/\{[\s\S]*?\}/g)];
    if (!matches.length) throw new Error("No JSON object found");
    return JSON.parse(matches[0][0]); 
  } catch (err) {
    console.error("❌ JSON extraction failed:", err.message);
    return null;
  }
};

const normalizeFoodType = (ft, fallback = "veg") => {
  if (!ft) return fallback;
  const map = {
    veg: "veg",
    vegetarian: "veg",
    non_veg: "non_veg",
    "non-veg": "non_veg",
    nonveg: "non_veg",
    egg: "egg",
    eggetarian: "egg",
  };
  return map[ft.toLowerCase()] || fallback;
};

export const analyzeImageWithGemini = async ({
  image_url,
  title = "",
  category = "",
  sub_category = "",
  food_type = "",
  description = "",
  resId = null,
}) => {
  try {
    const imageRes = await axios.get(image_url, {
      responseType: "arraybuffer",
    });
    const base64Image = Buffer.from(imageRes.data).toString("base64");

    const genAI = getRandomGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contextText = `
Given the following details about the dish:
- Title: ${title}
- Category: ${category}
- Sub-Category: ${sub_category}
- Food Type: ${food_type}
- Description: ${description}

And the image provided, generate a refined JSON object with:
{
  "title": "Name of the dish (use provided if good)",
  "auto_tags": ["auto-generated tag1", "tag2", ...],
  "cuisine": "Cuisine category",
  "quality_score": 1-10,
  "description": "Short description of the dish",
  "category": "Category of the dish",
  "sub_category": "Sub-category of the dish",
  "food_type": "Type of food (veg, non_veg, egg)"
}

Only return a valid JSON object with no extra text, markdown, or explanation.
    `.trim();

    const result = await model.generateContent([
      { text: contextText },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ]);

    const rawText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("🧠 Gemini raw response:", rawText);

    const extracted = extractValidJsonObjects(rawText);
    if (!extracted) throw new Error("Invalid Gemini output");

    const finalObject = {
      title: extracted.title || title || "Untitled",
      auto_tags: Array.isArray(extracted.auto_tags) ? extracted.auto_tags : [],
      cuisine: extracted.cuisine || "Unknown",
      quality_score: Math.min(
        Math.max(parseInt(extracted.quality_score) || 1, 1),
        10
      ),
      description: extracted.description || description,
      category: extracted.category || category,
      sub_category: extracted.sub_category || sub_category,
      food_type: normalizeFoodType(extracted.food_type, food_type || "veg"),
      image_url,
      approved: false,
      system_approved: true,
      premium: true,
      popularity_score: 0,
      likes: 0,
      source: "zomato",
      resId: resId || null,
    };

    return finalObject;
  } catch (error) {
    console.error("❌ Gemini analysis failed:", error.message);
    return null;
  }
};
