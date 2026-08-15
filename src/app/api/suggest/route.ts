import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dataSchema } = body;

    if (!dataSchema || dataSchema.length === 0) {
      return NextResponse.json({ suggestions: ["What is the total count?"] });
    }

    const prompt = `
      You are an expert Data Analyst.
      A user has uploaded a dataset with the following columns: ${JSON.stringify(dataSchema)}.
      Generate exactly 3 short, insightful questions the user could ask to analyze this data.
      Return the questions as a plain JSON array of strings. Do not include markdown formatting or backticks.
      Example: ["What is the trend over time?", "How does revenue compare by region?", "What is the average cost?"]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const resultText = response.text;
    if (!resultText) {
       throw new Error("No text returned from Gemini");
    }

    const suggestions = JSON.parse(resultText);

    return NextResponse.json({ suggestions });

  } catch (error: any) {
    console.error("Gemini Suggest API Error:", error);
    return NextResponse.json(
      { suggestions: ["Show me a summary", "Visualize the data", "What are the key trends?"] }
    );
  }
}
