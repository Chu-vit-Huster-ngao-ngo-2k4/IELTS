const axios = require('axios');

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  timeout: 30000, // 30 giây timeout
  maxRetries: 3,  // Số lần thử lại tối đa
  retryDelay: 1000 // Delay 1 giây giữa các lần thử
});

// Hàm retry khi gọi API thất bại
const retryRequest = async (config, retriesLeft) => {
  try {
    return await api(config);
  } catch (error) {
    if (retriesLeft === 0) throw error;
    
    // Đợi một khoảng thời gian trước khi thử lại
    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
    
    console.log(`Retrying request... (${config.maxRetries - retriesLeft + 1}/${config.maxRetries})`);
    return retryRequest(config, retriesLeft - 1);
  }
};

// Hàm tạo nội dung file Word
const generateWordContent = (essay, feedback, scores, prompt, taskType) => {
  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
    xmlns:w='urn:schemas-microsoft-com:office:word' 
    xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
    <meta charset='utf-8'>
    <title>IELTS Writing Assessment</title>
    <style>
      h1 { font-size: 32px; font-weight: bold; }
      h2 { font-size: 32px; font-weight: bold; }
      h3 { font-size: 24px; font-weight: bold; }
      h4 { font-size: 16px; font-weight: bold; text-decoration: underline;}
      p { font-size: 14px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid black; padding: 8px; }
    </style>
    </head>
    <body>
      <div class="e-con-inner">
        <div class="elementor-element elementor-element-3d33ae94 elementor-widget elementor-widget-heading" data-id="3d33ae94" data-element_type="widget" data-widget_type="heading.default">
          <div class="elementor-widget-container">
            <h2 class="elementor-heading-title elementor-size-default">ĐỀ BÀI</h2>
          </div>
        </div>
        <div class="elementor-element elementor-element-eba86c6 prompt e-flex e-con-boxed e-con e-child" data-id="eba86c6" data-element_type="container">
          ${prompt}
        </div>
        <div class="elementor-element elementor-element-127928e1 elementor-widget elementor-widget-heading" data-id="127928e1" data-element_type="widget" data-widget_type="heading.default">
          <div class="elementor-widget-container">
            <h2 class="elementor-heading-title elementor-size-default">BÀI LÀM</h2>
          </div>
        </div>
        <div class="elementor-element elementor-element-3bc9927c response e-flex e-con-boxed e-con e-child" data-id="3bc9927c" data-element_type="container">
          ${essay}
        </div>
        <div class="elementor-element elementor-element-58fedcd0 elementor-widget elementor-widget-heading" data-id="58fedcd0" data-element_type="widget" data-widget_type="heading.default">
          <div class="elementor-widget-container">
            <h2 class="elementor-heading-title elementor-size-default">OVERALL BAND SCORE: <span class="ovr-scr">${scores.overall}</span></h2>
          </div>
        </div>
        <div class="elementor-element elementor-element-7107c22a e-flex e-con-boxed e-con e-child" data-id="7107c22a" data-element_type="container">
          <div class="e-con-inner">
            <div class="elementor-element elementor-element-3c70e065 e-flex e-con-boxed e-con e-child" data-id="3c70e065" data-element_type="container">
              <div class="e-con-inner">
                <div class="elementor-element elementor-element-4532bdc2 e-flex e-con-boxed e-con e-child" data-id="4532bdc2" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                  <div class="e-con-inner">
                    <div class="elementor-element elementor-element-410c2c0 elementor-widget elementor-widget-text-editor" data-id="410c2c0" data-element_type="widget" data-widget_type="text-editor.default">
                      <div class="elementor-widget-container">
                        <h3>Task Response: <span class="tr-0">${scores.taskResponse}</span></h3>
                        <ul>
                          <li>Relevance to Prompt: <span class="tr-1">${scores.taskResponse}</span></li>
                          <li>Clarity of Position: <span class="tr-2">${scores.taskResponse}</span></li>
                          <li>Depth of Ideas: <span class="tr-3">${scores.taskResponse}</span></li>
                          <li>Appropriateness of Format: <span class="tr-4">${scores.taskResponse}</span></li>
                          <li>Relevant & Specific Examples: <span class="tr-5">${scores.taskResponse}</span></li>
                          <li>Appropriate Word Count: <span class="tr-6">${scores.taskResponse}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="elementor-element elementor-element-4afc02df e-flex e-con-boxed e-con e-child" data-id="4afc02df" data-element_type="container">
                  <div class="e-con-inner">
                    <div class="elementor-element elementor-element-61740cde elementor-widget elementor-widget-text-editor" data-id="61740cde" data-element_type="widget" data-widget_type="text-editor.default">
                      <div class="elementor-widget-container">
                        <h3>Coherence & Cohesion: <span class="cc-0">${scores.coherence}</span></h3>
                        <ul>
                          <li>Logical Organization: <span class="cc-1">${scores.coherence}</span></li>
                          <li>Effective Introduction & Conclusion: <span class="cc-2">${scores.coherence}</span></li>
                          <li>Supported Main Points: <span class="cc-3">${scores.coherence}</span></li>
                          <li>Cohesive Devices Usage: <span class="cc-4">${scores.coherence}</span></li>
                          <li>Paragraphing: <span class="cc-5">${scores.coherence}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="elementor-element elementor-element-3b66c608 e-flex e-con-boxed e-con e-child" data-id="3b66c608" data-element_type="container">
              <div class="e-con-inner">
                <div class="elementor-element elementor-element-338f24c5 e-flex e-con-boxed e-con e-child" data-id="338f24c5" data-element_type="container">
                  <div class="e-con-inner">
                    <div class="elementor-element elementor-element-3ebe2e59 elementor-widget elementor-widget-text-editor" data-id="3ebe2e59" data-element_type="widget" data-widget_type="text-editor.default">
                      <div class="elementor-widget-container">
                        <h3>Lexical Resource: <span class="lr-0">${scores.vocabulary}</span></h3>
                        <ul>
                          <li>Vocabulary Range: <span class="lr-1">${scores.vocabulary}</span></li>
                          <li>Lexical Accuracy: <span class="lr-2">${scores.vocabulary}</span></li>
                          <li>Spelling and Word Formation: <span class="lr-3">${scores.vocabulary}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="elementor-element elementor-element-7f255f8e e-flex e-con-boxed e-con e-child" data-id="7f255f8e" data-element_type="container">
                  <div class="e-con-inner">
                    <div class="elementor-element elementor-element-30549612 elementor-widget elementor-widget-text-editor" data-id="30549612" data-element_type="widget" data-widget_type="text-editor.default">
                      <div class="elementor-widget-container">
                        <h3>Grammatical Range & Accuracy: <span class="gra-0">${scores.grammar}</span></h3>
                        <ul>
                          <li>Sentence Structure Variety: <span class="gra-1">${scores.grammar}</span></li>
                          <li>Grammar Accuracy: <span class="gra-2">${scores.grammar}</span></li>
                          <li>Punctuation Usage: <span class="gra-3">${scores.grammar}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="elementor-element elementor-element-43afea21 elementor-widget elementor-widget-heading" data-id="43afea21" data-element_type="widget" data-widget_type="heading.default">
          <div class="elementor-widget-container">
            <h2 class="elementor-heading-title elementor-size-default">NHẬN XÉT CHI TIẾT</h2>
          </div>
        </div>
        <div class="elementor-element elementor-element-58d2eb11 detailed-feedback e-flex e-con-boxed e-con e-child" data-id="58d2eb11" data-element_type="container">
          ${feedback}
        </div>
      </div>
    </body>
    </html>
  `;
};

const analyzeEssay = async (req, res) => {
  const { essay, taskType = 'Task 2', prompt } = req.body;

  if (!essay) {
    return res.status(400).json({ error: "Missing essay content" });
  }

  try {
    // Cấu hình request
    const config = {
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      data: {
        model: "openai/gpt-4.1-nano", // Hoặc thử openchat-3.5 nếu muốn nhanh hơn
        messages: [
          {
            role: "system",
            content: `
Bạn là một giám khảo IELTS Writing chuyên nghiệp. Hãy phân tích bài viết theo format sau:

# 🎯 Let's goooo! 💥
## Mình sẽ chấm bài này theo format IELTS Writing ${taskType}${prompt ? ` – ${prompt}` : ''}.
Cùng xem thử bài này đang ở mức band IELTS bao nhiêu và cách cải thiện nhé!

# 🧠 Phân tích chi tiết theo tiêu chí IELTS Writing

## 🔹 1. Task Achievement (TA) – Band X.X
### ✅ Điểm mạnh về nội dung
- [Liệt kê các điểm mạnh]

### ❌ Điểm yếu về nội dung
- [Liệt kê các điểm yếu]

### ❌ Các lỗi cụ thể về task response
- [Liệt kê các lỗi]

## 🔹 2. Coherence and Cohesion (CC) – Band X.X
### ✅ Điểm mạnh về bố cục và liên kết
- [Liệt kê các điểm mạnh]

### ❌ Điểm yếu về bố cục và liên kết
- [Liệt kê các điểm yếu]

### ❌ Các lỗi cụ thể về coherence và cohesion
- [Liệt kê các lỗi]

## 🔹 3. Lexical Resource (LR) – Band X.X
### ✅ Từ vựng tốt đã sử dụng
- [Liệt kê các từ vựng tốt]

### ❌ Từ vựng còn hạn chế
- [Liệt kê các từ vựng cần cải thiện]

### ❌ Các lỗi cụ thể về từ vựng
- [Liệt kê các lỗi]

## 🔹 4. Grammatical Range and Accuracy (GRA) – Band X.X
### ✅ Cấu trúc ngữ pháp tốt
- [Liệt kê các cấu trúc tốt]

### ❌ Các lỗi ngữ pháp
- [Liệt kê các lỗi]

### ❌ Các cấu trúc cần cải thiện
- [Liệt kê các cấu trúc]

# 📊 Tổng kết band điểm
## 🌟 Band X.X
[Đánh giá tổng quan về bài viết]

# 🛠 Gợi ý sửa bài (Band 7.0+ Sample)
## 🔥 Viết lại đoạn mở bài + overview cho chuẩn:
> [Sample introduction]

## ✅ Viết lại 1-2 đoạn thân bài mẫu:
> [Sample body paragraphs]

Lưu ý:
- Nên hạ xuống 1 band điểm với đánh giá thực tế
- Phân tích chi tiết từng tiêu chí
- Đưa ra ví dụ cụ thể cho mỗi lỗi
- Gợi ý cách sửa rõ ràng
- Đưa ra bài mẫu band 7.0+ để tham khảo
- Sử dụng emoji để tạo sự thân thiện
- Giữ phong cách gần gũi nhưng vẫn chuyên nghiệp
`.trim()
          },
          {
            role: "user",
            content: `Task Type: ${taskType}\nPrompt: ${prompt || 'No prompt provided'}\n\nEssay:\n${essay}\n\nAnalyze this IELTS Writing essay strictly and return detailed feedback with scores.`
          }
        ]
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'IELTS Writing Assistant'
      }
    };

    console.log("Sending request to OpenRouter API...");
    // Gọi API với retry logic
    const response = await retryRequest(config, config.maxRetries);

    // Kiểm tra và xử lý response
    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error("Invalid response format from AI service");
    }

    // Parse scores from feedback content
    const content = response.data.choices[0].message.content;
    const scoresMatch = content.match(/(Band ước tính|Estimated Band): \*\*(\d+\.?\d*)\*\*/);
    const overallScore = scoresMatch ? parseFloat(scoresMatch[2]) : 0;

    // Parse individual scores
    const taskResponseMatch = content.match(/Task Response: \*\*(\d+\.?\d*)\*\*/);
    const coherenceMatch = content.match(/Coherence & Cohesion: \*\*(\d+\.?\d*)\*\*/);
    const grammarMatch = content.match(/Grammatical Range & Accuracy: \*\*(\d+\.?\d*)\*\*/);
    const vocabularyMatch = content.match(/Lexical Resource: \*\*(\d+\.?\d*)\*\*/);

    const scores = {
      overall: overallScore,
      taskResponse: taskResponseMatch ? parseFloat(taskResponseMatch[1]) : overallScore,
      coherence: coherenceMatch ? parseFloat(coherenceMatch[1]) : overallScore,
      grammar: grammarMatch ? parseFloat(grammarMatch[1]) : overallScore,
      vocabulary: vocabularyMatch ? parseFloat(vocabularyMatch[1]) : overallScore
    };

    // Generate Word document content
    const wordContent = generateWordContent(essay, content, scores, prompt, taskType);

    res.json({
      ...response.data,
      wordContent,
      scores
    });
  } catch (error) {
    console.error("❌ AI chấm lỗi:", error?.response?.data || error.message);
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: "⏱️ Timeout khi kết nối tới OpenRouter. Vui lòng thử lại sau.",
        details: "Có thể do mạng chậm hoặc server quá tải."
      });
    }
    
    if (error.response) {
      // Lỗi từ API
      return res.status(error.response.status).json({
        error: "Error from AI service",
        details: error.response.data
      });
    }
    
    // Lỗi khác
    res.status(500).json({
      error: "Failed to analyze essay",
      message: error.message
    });
  }
};

const compareWithModel = async (req, res) => {
    try {
        const { userEssay, taskType, question } = req.body;
        console.log('Received request:', { taskType, question, userEssayLength: userEssay.length });

        // Tạo prompt để yêu cầu AI viết bài mẫu band 8.0
        const modelPrompt = `Write a Band 8.0 IELTS ${taskType} essay for the following question:
        "${question}"
        
        Requirements for Band 8.0:
        1. Task Response:
           - Fully addresses all parts of the question
           - Presents a well-developed response with relevant, extended and supported ideas
           - Clear position throughout the response
        
        2. Coherence and Cohesion:
           - Sequences information and ideas logically
           - Manages all aspects of cohesion well
           - Uses paragraphing sufficiently and appropriately
        
        3. Lexical Resource:
           - Uses a wide range of vocabulary fluently and flexibly
           - Uses less common lexical items with precision
           - Rare minor errors in word choice and collocation
        
        4. Grammatical Range and Accuracy:
           - Uses a wide range of structures
           - Majority of sentences are error-free
           - Makes only very occasional errors or inappropriacies

        Please write a complete essay that meets these requirements.`;

        console.log('Sending model generation request...');
        // Gọi OpenRouter API để tạo bài mẫu
        const modelConfig = {
            method: 'post',
            url: 'https://openrouter.ai/api/v1/chat/completions',
            data: {
                model: "openai/gpt-4.1-nano",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an IELTS writing expert with Band 9.0. Write a complete model essay that demonstrates Band 8.0 level writing skills. The essay should be well-structured with introduction, body paragraphs, and conclusion." 
                    },
                    { role: "user", content: modelPrompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:5000',
                'X-Title': 'IELTS Writing Assistant'
            }
        };

        console.log('Waiting for model response...');
        const modelResponse = await retryRequest(modelConfig, modelConfig.maxRetries);
        console.log('Received model response');
        
        if (!modelResponse.data || !modelResponse.data.choices || !modelResponse.data.choices[0] || !modelResponse.data.choices[0].message) {
            throw new Error('Invalid response format from AI service');
        }

        const modelEssay = modelResponse.data.choices[0].message.content;
        console.log('Generated model essay length:', modelEssay.length);

        // Phân tích sự khác biệt giữa hai bài
        const comparisonPrompt = `Analyze and compare these two IELTS ${taskType} essays. The first is the user's essay, and the second is a Band 8.0 model essay. Provide a detailed comparison in Vietnamese, with English words in bold and English sentences in italics. Use this format:

        # 🎯 Phân Tích So Sánh

        ## 🔹 1. Task Response (Trả lời câu hỏi)
        ### ✅ Những điểm mạnh trong bài mẫu:
        - [Liệt kê các ví dụ cụ thể từ bài mẫu, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### ❌ Những điểm cần cải thiện trong bài của bạn:
        - [Liệt kê các ví dụ cụ thể từ bài của bạn, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### 💡 Gợi ý cải thiện:
        - [Đưa ra các gợi ý cụ thể, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]

        ## 🔹 2. Coherence and Cohesion (Tính mạch lạc và liên kết)
        ### ✅ Những điểm mạnh trong bài mẫu:
        - [Liệt kê các ví dụ cụ thể từ bài mẫu, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### ❌ Những điểm cần cải thiện trong bài của bạn:
        - [Liệt kê các ví dụ cụ thể từ bài của bạn, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### 💡 Gợi ý cải thiện:
        - [Đưa ra các gợi ý cụ thể, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]

        ## 🔹 3. Lexical Resource (Từ vựng)
        ### ✅ Từ vựng nâng cao trong bài mẫu:
        - [Liệt kê các ví dụ cụ thể từ bài mẫu, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### ❌ Hạn chế từ vựng trong bài của bạn:
        - [Liệt kê các ví dụ cụ thể từ bài của bạn, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### 💡 Gợi ý cải thiện từ vựng:
        - [Đưa ra các gợi ý cụ thể, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]

        ## 🔹 4. Grammatical Range and Accuracy (Ngữ pháp)
        ### ✅ Cấu trúc phức tạp trong bài mẫu:
        - [Liệt kê các ví dụ cụ thể từ bài mẫu, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### ❌ Vấn đề ngữ pháp trong bài của bạn:
        - [Liệt kê các ví dụ cụ thể từ bài của bạn, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]
        ### 💡 Gợi ý cải thiện ngữ pháp:
        - [Đưa ra các gợi ý cụ thể, với từ tiếng Anh in **đậm** và câu tiếng Anh in *nghiêng*]

        User's essay:
        "${userEssay}"
        
        Model essay (Band 8.0):
        "${modelEssay}"`;

        console.log('Sending comparison request...');
        const comparisonConfig = {
            method: 'post',
            url: 'https://openrouter.ai/api/v1/chat/completions',
            data: {
                model: "openai/gpt-4.1-nano",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an IELTS writing expert analyzing essay differences. Provide detailed feedback in Vietnamese, with English words in bold and English sentences in italics. Use markdown formatting for bold (**word**) and italics (*sentence*)." 
                    },
                    { role: "user", content: comparisonPrompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:5000',
                'X-Title': 'IELTS Writing Assistant'
            }
        };

        console.log('Waiting for comparison response...');
        const comparisonResponse = await retryRequest(comparisonConfig, comparisonConfig.maxRetries);
        console.log('Received comparison response');

        if (!comparisonResponse.data || !comparisonResponse.data.choices || !comparisonResponse.data.choices[0] || !comparisonResponse.data.choices[0].message) {
            throw new Error('Invalid response format from AI service');
        }

        const comparison = comparisonResponse.data.choices[0].message.content;
        console.log('Generated comparison length:', comparison.length);

        res.json({
            userEssay,
            modelEssay,
            comparison,
            taskType,
            question
        });

    } catch (error) {
        console.error('Error in compareWithModel:', error);
        res.status(500).json({
            error: 'Failed to compare essays',
            message: error.message
        });
    }
};

module.exports = {
  analyzeEssay,
  compareWithModel
}; 