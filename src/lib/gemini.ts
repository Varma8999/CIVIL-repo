import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function categorizeComplaint(title: string, description: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are an AI assistant for a civic complaint management system.
Your job is to read the complaint and determine its category and urgency (priority).

Title: ${title}
Description: ${description}

Categories: Sanitation, Roads, Water, Waste Management, Electricity, Other
Priority options: Low, Medium, High

If there is mentioning of severe safety risks, bursting pipes, deep potholes on main roads, raw sewage, or downed power lines, assign High priority.
If there are minor inconveniences (light bulb out, slight litter), assign Low priority.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The assigned category of the complaint",
            },
            priority: {
              type: Type.STRING,
              description: "The assigned priority level of the complaint",
            }
          },
          required: ["category", "priority"]
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return {
      category: result.category || 'Other',
      priority: result.priority || 'Medium'
    };
  } catch (error) {
    console.error("Gemini classification failed", error);
    return { category: 'Other', priority: 'Medium' };
  }
}
