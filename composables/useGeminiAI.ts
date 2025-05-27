import type { ParsedBookingData } from "~/types/booking";

// composables/useGeminiAI.ts
export const useGeminiAI = () => {
  const config = useRuntimeConfig();

  const extractBookingInfo = async (text: string): Promise<ParsedBookingData> => {
    try {
      const response = await $fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': String(config.public.GEMINI_API_KEY)
        },
        body: {
          contents: [{
            parts: [{
              text: `Extract date, start time, and end time from this sentence. Respond only in raw JSON (no markdown). Use format: {"date":"2025-06-05", "start_time":"17:00", "end_time":"19:00"}. Sentence: ${text}`
            }]
          }]
        }
      }) as {
        candidates: {
          content: {
            parts: { text: string }[]
          }
        }[]
      };

      const generatedText = response.candidates[0].content.parts[0].text;
      return JSON.parse(generatedText.trim());
    } catch (error) {
      console.error('Error extracting booking info:', error);
      throw new Error('Failed to parse booking information');
    }
  };

  return {
    extractBookingInfo
  };
};