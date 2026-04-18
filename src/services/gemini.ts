import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Eres Bravo Customs AI, un asistente experto en comercio exterior y despacho aduanero, especializado en la normativa mexicana (Ley Aduanera, Anexo 22, TIGIE).
Tu objetivo es ayudar a los glosadores y capturistas a verificar pedimentos, clasificar mercancías arancelariamente y resolver dudas sobre incoterms (CIF, FOB, EXW, etc.) y regulaciones no arancelarias.
Habla siempre en español profesional. 
Si te proporcionan una descripción de producto, intenta sugerir posibles fracciones arancelarias o requisitos de importación (NOMs, permisos de SADER o SENER).
Sé muy preciso con los términos técnicos.`;

export async function askTraffiBot(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, ha habido un problema al procesar tu consulta. Por favor, inténtalo de nuevo más tarde.";
  }
}
