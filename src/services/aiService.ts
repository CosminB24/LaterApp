import { getGeminiModel } from '../config/gemini';

interface SubTask {
  title: string;
  suggestedTime: string;
  description?: string;
}

export const aiService = {
  decomposeTask: async (taskTitle: string, taskDescription: string, date: string): Promise<SubTask[]> => {
    try {
      const model = await getGeminiModel();
      
      const prompt = `Descompune următoarea sarcină în subtask-uri logice cu timeline-uri sugerate pentru data ${date}:
      Titlu: ${taskTitle}
      Descriere: ${taskDescription}
      
      Răspunde doar cu un array JSON în următorul format, fără alte explicații:
      [
        {
          "title": "Subtask 1",
          "suggestedTime": "HH:mm",
          "description": "Descriere opțională"
        }
      ]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Eroare la generarea subtask-urilor:', error);
      throw error;
    }
  }
}; 