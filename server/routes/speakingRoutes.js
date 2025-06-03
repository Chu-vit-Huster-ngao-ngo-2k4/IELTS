const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/feedback', async (req, res) => {
  const { audio, topic } = req.body;

  if (!audio || !topic) {
    return res.status(400).json({ error: "Missing required fields: audio or topic" });
  }

  try {
    console.log("Starting audio transcription...");
    console.log("Audio data length:", audio.length);
    console.log("Topic:", topic);

    // First, convert audio to text using Whisper
    try {
      const whisperResponse = await axios.post(
        'https://api.openrouter.ai/api/v1/audio/transcriptions',
        {
          model: "openai/whisper-1",
          audio: audio
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'IELTS Speaking Assistant'
          }
        }
      );

      console.log("Transcription successful:", whisperResponse.data);
      const transcription = whisperResponse.data.text;

      if (!transcription) {
        throw new Error("No transcription received from Whisper API");
      }

      console.log("Getting AI feedback...");
      // Then, get AI feedback on the speech
      const response = await axios.post(
        'https://api.openrouter.ai/api/v1/chat/completions',
        {
          model: "openai/gpt-4.1-nano",
          messages: [
            {
              role: "system",
              content: `
Bạn là một giám khảo IELTS Speaking khó tính, chấm nghiêm khắc (luôn chấm thấp hơn 0.5–1.0 band so với thực tế). Phản hồi bằng **tiếng Việt**, dễ hiểu, súc tích và có phân đoạn rõ ràng bằng Markdown và emoji. Dùng tiếng Anh *chỉ khi là từ ngữ chuyên môn hoặc từ vựng IELTS*.

Cấu trúc phản hồi như sau:

### 🏁 Band điểm tổng quan
- Band ước tính: **6.0**
- Một dòng cảm nhận chung
- Thời gian nói có phù hợp không? (Part 2 nên nói 1-2 phút)

### ✅ Điểm mạnh
- Những điểm làm tốt (về nội dung, phát âm, từ vựng...)
- Highlight các từ vựng tốt bằng **bold** và emoji 🌟
- Đánh giá cách mở đầu và kết thúc

### ⚠️ Điểm cần cải thiện
1. **Fluency and Coherence** – nói trôi chảy? có ngập ngừng nhiều không?
2. **Lexical Resource** – từ vựng đa dạng? có lặp từ không?
3. **Grammatical Range and Accuracy** – ngữ pháp đúng? câu đa dạng chưa?
4. **Pronunciation** – phát âm rõ ràng? có lỗi phát âm nào không?

### 📈 Làm sao để nâng band lên 7.0+
- Mỗi tiêu chí, đưa 1–2 tips cụ thể, ngắn gọn, có thể áp dụng ngay
- Gợi ý cách mở đầu và kết thúc tốt hơn
- Đề xuất các từ vựng nâng cao có thể thay thế

## ✍️ Gợi ý sửa lỗi
Dưới đây là những lỗi trong bài nói. Hãy chú ý mấy chỗ này nhé:

> ❌ **Lỗi:** [mô tả lỗi]
> 💡 **Gợi ý:** [cách sửa hoặc lời giải thích ngắn]

Hãy viết phản hồi ngắn gọn, dễ nhìn, tránh lan man. Nếu có thể, hãy dùng emoji nhẹ nhàng và phong cách gần gũi như Gen Z nhưng vẫn giữ sự chuyên nghiệp.
Nếu bài nói có lỗi nặng, bạn có thể chêm nhẹ vài câu cảm thán vui vẻ như "Trời ơi câu này sai band liền đó bạn ơi 😭" nhưng không châm biếm quá đà.

Lưu ý:
- Giữ feedback trong khoảng 500-800 từ
- Highlight tối đa 3-4 lỗi cần sửa
- Tập trung vào các lỗi ảnh hưởng đến band điểm
- Đưa ra gợi ý cụ thể và thực tế
`.trim()
            },
            {
              role: "user",
              content: `Topic: ${topic}\n\nTranscription: ${transcription}\n\nAnalyze this IELTS Speaking Part 2 response strictly and return detailed feedback.`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'IELTS Speaking Assistant'
          }
        }
      );

      console.log("AI feedback received successfully");
      res.json(response.data);
    } catch (apiError) {
      console.error("API Error Details:", {
        status: apiError.response?.status,
        code: apiError.code,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        message: apiError.message
      });
    
      if (apiError.code === 'ETIMEDOUT') {
        return res.status(504).json({ error: "⏱️ Timeout khi kết nối tới OpenRouter. Kiểm tra mạng hoặc thử VPN nha." });
      }
    
      if (apiError.response?.status === 401) {
        return res.status(401).json({ error: "API key sai hoặc hết hạn. Kiểm tra lại env đi ông giáo." });
      }
    
      if (apiError.response?.status === 429) {
        return res.status(429).json({ error: "Bạn gọi API nhiều quá rồi 😵. Đợi tí rồi thử lại nha." });
      }
    
      if (apiError.response?.status === 400) {
        return res.status(400).json({ error: "Audio gửi lên có thể bị lỗi. Gửi lại bản ghi khác thử nha." });
      }
    
      if (apiError.message.includes("No transcription")) {
        return res.status(400).json({ error: "Không nhận được bản chép lời từ Whisper. Gửi lại audio thử nha." });
      }
    
      return res.status(500).json({ 
        error: "Lỗi không xác định khi xử lý. Có thể do mạng hoặc cấu hình API. Thử lại sau nha.",
        details: process.env.NODE_ENV === 'development' ? apiError.message : undefined
      });
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    res.status(500).json({ error: "Lỗi không xác định. Thử lại sau nha." });
  }
});

module.exports = router; 