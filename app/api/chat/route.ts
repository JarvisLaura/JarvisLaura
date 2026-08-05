import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6IFR0N3pc04mY4oAGwU0zPzAa7CqCU2KNkp7WINKsBI6Q" });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    let response;
    try {
      // Attempt with the newest stable flash model
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are Laura, a highly advanced holographic AI assistant. Keep your answers concise, conversational, professional, and natural for speech output.",
        },
      });
    } catch (primaryError) {
      // Fallback model if primary experiences high demand
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are Laura, a highly advanced holographic AI assistant. Keep your answers concise, conversational, professional, and natural for speech output.",
        },
      });
    }

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Detailed Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process prompt" },
      { status: 500 }
    );
  }
}
