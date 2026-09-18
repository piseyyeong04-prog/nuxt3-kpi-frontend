// composables/useGeminiAI.ts
import type { ParsedBookingData } from "~/types/booking";

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
              text: `Extract date, start time, end time, room ("Large Room" or "Small Room", default to "Large Room" if not mentioned), and purpose from this sentence. If "morning" is mentioned without specific hours, use start_time: "08:00" and end_time: "12:00". If "afternoon" is mentioned without specific hours, use start_time: "13:00" and end_time: "17:00". If "full day" is mentioned, use start_time: "08:00" and end_time: "17:00". Respond only in raw JSON (no markdown). Use format: {\"date\":\"2025-06-05\", \"start_time\":\"17:00\", \"end_time\":\"19:00\", \"room\":\"Large Room\", \"purpose\":\"team meeting\"}. Sentence: ${text}`
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
