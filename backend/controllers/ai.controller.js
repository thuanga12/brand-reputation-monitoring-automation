import { GoogleGenerativeAI } from "@google/generative-ai";
import ReviewHighland from "../models/ReviewHighland.js";
import CRM from "../models/CRM.js";
import AIChat from "../models/AIChat.js";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "dummy_key");

// Danh sách các model khả dụng để xoay vòng khi bị Rate Limit (429)
const AVAILABLE_MODELS = [
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash-lite",
  "gemini-pro-latest"
];

// 1. Gửi tin nhắn và nhận phản hồi từ AI
export const askConsultant = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user.id; // Lấy ID từ token

    if (!message) {
      return res.status(400).json({ message: "Vui lòng nhập câu hỏi!" });
    }

    // A. Thu thập dữ liệu ngữ cảnh (Context)
    const [recentReviews, crmStrategy] = await Promise.all([
      ReviewHighland.find().sort({ published_at: -1 }).limit(20).lean(),
      CRM.findOne().sort({ _id: -1 }).lean()
    ]);

    const context = `
HỆ THỐNG DỮ LIỆU HIỆN TẠI:
- Đánh giá gần đây: ${JSON.stringify(recentReviews.map(r => ({ rating: r.rating, text: r.review_text, branch: r.address })))}
- Chiến lược CRM hiện tại: Churn Rate ${crmStrategy?.churn_risk_rate || 'N/A'}, Lý do churn: ${crmStrategy?.churn_reason || 'N/A'}
- Hành động phục hồi: ${crmStrategy?.recovery_action || 'N/A'}

VAI TRÒ CỦA BẠN:
Bạn là "Trợ lý AI Tư vấn Chiến lược" cao cấp của Highlands Coffee. Nhiệm vụ của bạn là phân tích dữ liệu trên và trả lời câu hỏi của quản lý một cách chuyên nghiệp, sắc bén và có tính hành động cao.

HƯỚNG DẪN TRẢ LỜI:
- Sử dụng tiếng Việt, văn phong chuyên nghiệp nhưng gần gũi.
- Luôn dẫn chứng số liệu hoặc nội dung từ dữ liệu được cung cấp.
- Nếu câu hỏi không liên quan đến dữ liệu, hãy trả lời dựa trên kiến thức chuyên môn về F&B và quản trị thương hiệu.
- Định dạng câu trả lời bằng Markdown (in đậm, danh sách, bảng nếu cần).
`;

    // B. Xử lý gọi AI với cơ chế xoay vòng model
    let lastError = null;
    let aiResponseText = "";
    let finalModel = "";
    
    for (const modelName of AVAILABLE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: context }] },
            { role: "model", parts: [{ text: "Tôi đã hiểu vai trò và dữ liệu của mình. Tôi đã sẵn sàng tư vấn cho bạn về chiến lược thương hiệu và vận hành Highlands Coffee. Bạn cần hỗ trợ gì hôm nay?" }] },
            ...(history || []).map(h => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }]
            }))
          ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        aiResponseText = response.text();
        finalModel = modelName;
        break; // Thành công thì thoát vòng lặp
      } catch (err) {
        lastError = err;
        if (err.status !== 429) break;
      }
    }

    if (!aiResponseText) {
      throw lastError;
    }

    // C. LƯU VÀO DATABASE
    let chatRecord = await AIChat.findOne({ userId });
    if (!chatRecord) {
      chatRecord = new AIChat({ userId, messages: [] });
    }

    chatRecord.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: aiResponseText }
    );
    chatRecord.lastInteraction = new Date();
    await chatRecord.save();

    res.status(200).json({
      success: true,
      answer: aiResponseText,
      modelUsed: finalModel
    });

  } catch (error) {
    console.error("Lỗi AI Consultant:", error);
    const status = error.status || 500;
    const msg = status === 429 
      ? "Tất cả các phiên bản AI hiện đang bận. Vui lòng đợi 30 giây." 
      : "Lỗi kết nối trí tuệ nhân tạo!";
    
    res.status(status).json({ success: false, message: msg });
  }
};

// 2. Lấy lịch sử trò chuyện
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await AIChat.findOne({ userId });
    res.status(200).json({
      success: true,
      messages: chat ? chat.messages : []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy lịch sử chat" });
  }
};

// 3. Xóa lịch sử trò chuyện
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    await AIChat.findOneAndDelete({ userId });
    res.status(200).json({ success: true, message: "Đã xóa lịch sử trò chuyện" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi xóa lịch sử chat" });
  }
};
