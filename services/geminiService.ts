
import { GoogleGenAI } from "@google/genai";
import { Role, Message } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private modelName = 'gemini-3-flash-preview';
  
  private readonly FIXED_WEBSITES = [
    "https://www.lung.org/lung-health-diseases/lung-disease-lookup/pertussis",
    "https://www.clalit.co.il/he/your_health/family/Pages/whooping_cough.aspx",
    "https://en.wikipedia.org/wiki/Whooping_cough",
    "https://www.cdc.gov/pertussis/about/index.html",
    "https://medlineplus.gov/whoopingcough.html",
    "https://www.cdc.gov/pertussis/hcp/clinical-overview/index.html?utm_source=chatgpt.com",
    "https://www.who.int/health-topics/pertussis?utm_source=chatgpt.com#tab=tab_1",
    "https://www.paho.org/en/topics/pertussis?utm_source=chatgpt.com",
    "https://www.nhs.uk/conditions/whooping-cough",
    "https://www.hopkinsmedicine.org/health/conditions-and-diseases/pertussis-in-children?",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC4205565/",
    "https://www.gov.il/he/pages/disease-pertussis",
    "https://me.health.gov.il/en/parenting/raising-children/immunization-schedule/vaccines-up-to-age-six/mehumash/pertussis",
    "https://yeladim.sheba.co.il/%D7%A9%D7%A2%D7%9C%D7%AA",
    "https://www.schneider.org.il/?ArticleID=3414&CategoryID=856&",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC10600895/"
  ];

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateResponse(
    prompt: string, 
    history: Message[]
  ): Promise<{ text: string; sources: Array<{ title: string; uri: string }> }> {
    try {
      // Prepare chat history for the API to maintain "memory"
      const contents = history.map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Add the current prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const systemInstruction = `You are a friendly biology tutor. Only answer using the supplied URLs: ${this.FIXED_WEBSITES.join(', ')}. 
      Keep explanations simple for students. Make sure your answers are concise and clear.
      At the end of every response, you MUST explicitly state in Hebrew which sources from the list were used for that answer.
      
      עליך לענות בעברית בלבד. 
      הקפד על תשובות ברורות, קצרות, מנומסות ומדויקות בעברית.
      בסוף כל תשובה, עליך לציין בבירור באילו מקורות השתמשת מתוך הרשימה שסופקה לך.`;

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "סליחה, לא הצלחתי לייצר תשובה.";
      
      // Extract grounding sources
      const sources: Array<{ title: string; uri: string }> = [];
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              uri: chunk.web.uri
            });
          }
        });
      }

      return { text, sources };
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new Error(error.message || "שגיאה בתקשורת עם ה-AI");
    }
  }
}
