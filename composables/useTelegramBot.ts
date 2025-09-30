// composables/useTelegramBot.ts
import axios from "axios";

export const useTelegramBot = () => {
  const config = useRuntimeConfig();

  const sendMessage = async (message: string, threadId?: number) => {
    try {
      const botToken = config.public.TELEGRAM_BOT_TOKEN;
      const chatId = config.public.TELEGRAM_CHAT_ID; // supergroup id (-100xxxx)
      
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const payload: Record<string, any> = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      };

      // If you want to send inside a topic
      if (threadId) {
        payload.message_thread_id = threadId;
      }

      const res = await axios.post(url, payload);
      return res.data;
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  };

  return { sendMessage };
};

