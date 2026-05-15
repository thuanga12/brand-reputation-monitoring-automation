import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Bot, User, Sparkles, MessageSquare, 
  Trash2, RefreshCw, ChevronRight, Zap, Target, TrendingUp 
} from "lucide-react";
import { askAIConsultant, getAIChatHistory, clearAIChatHistory } from "../../api/aiApi";
import { toast } from "react-hot-toast";

const QuickQuery = ({ icon: Icon, text, onClick }) => (
  <button 
    onClick={() => onClick(text)}
    className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#B22830] hover:shadow-md transition-all text-left group"
  >
    <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-[#B22830]/10 group-hover:text-[#B22830] rounded-xl transition-colors">
      <Icon size={18} />
    </div>
    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{text}</span>
  </button>
);

const Message = ({ role, content }) => {
  const isAI = role === "assistant" || role === "model";
  return (
    <div className={`flex gap-4 ${isAI ? "justify-start" : "justify-end"}`}>
      {isAI && (
        <div className="w-10 h-10 rounded-2xl bg-[#B22830] flex items-center justify-center text-white shadow-lg shrink-0">
          <Bot size={20} />
        </div>
      )}
      <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm border ${
        isAI 
          ? "bg-white border-slate-100 text-slate-800 rounded-tl-none" 
          : "bg-slate-900 border-slate-800 text-white rounded-tr-none"
      }`}>
        <div className="text-xs font-black uppercase tracking-widest mb-2 opacity-50 flex items-center gap-2">
          {isAI ? <><Sparkles size={12} /> AI Strategy Consultant</> : <><User size={12} /> Manager</>}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
      {!isAI && (
        <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-600 shadow-md shrink-0">
          <User size={20} />
        </div>
      )}
    </div>
  );
};

const AIConsultantPage = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Xin chào! Tôi là Trợ lý Chiến lược AI của Highlands Coffee. Tôi đã sẵn sàng phân tích dữ liệu và tư vấn cho bạn về vận hành, chăm sóc khách hàng và phát triển thương hiệu. Bạn muốn hỏi tôi điều gì hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Lấy lịch sử từ Database khi vào trang
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getAIChatHistory();
        if (res.success && res.messages.length > 0) {
          setMessages(res.messages);
        }
      } catch (error) {
        console.error("Không thể tải lịch sử chat");
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Lọc bỏ tin nhắn mặc định đầu tiên nếu cần, hoặc gửi toàn bộ history
      const historyForAI = messages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));

      const res = await askAIConsultant(text, historyForAI);
      
      if (res.success) {
        setMessages(prev => [...prev, { role: "assistant", content: res.answer }]);
      } else {
        const errMsg = res.message || "AI đang bận, vui lòng thử lại sau!";
        toast.error(errMsg);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Lỗi kết nối hệ thống AI!";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không?")) {
      try {
        await clearAIChatHistory();
        setMessages([{ role: "assistant", content: "Đã xóa lịch sử. Tôi đã sẵn sàng hỗ trợ bạn từ đầu!" }]);
        toast.success("Đã xóa lịch sử thành công");
      } catch (error) {
        toast.error("Không thể xóa lịch sử");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-[#B22830]" /> AI Strategic <span className="text-[#B22830]">Consultant</span>
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Dữ liệu phân tích thời gian thực từ CRM & Reviews</p>
        </div>
        <button 
          onClick={clearChat}
          className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
          title="Xóa hội thoại"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50 rounded-[40px] border border-slate-200 overflow-hidden relative shadow-inner">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
          >
            {messages.map((msg, i) => (
              <Message key={i} {...msg} />
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <Bot size={20} />
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi AI về chiến lược kinh doanh hoặc phân tích review..."
                className="w-full pl-6 pr-20 py-5 bg-slate-100 border-none rounded-[24px] focus:ring-2 focus:ring-[#B22830] outline-none text-sm font-medium shadow-inner"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-4 bg-[#B22830] text-white rounded-2xl shadow-lg hover:bg-red-800 transition-all disabled:opacity-50 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Suggestions */}
        <div className="w-80 space-y-6 hidden xl:block">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" /> Truy vấn nhanh
            </h3>
            <div className="flex flex-col gap-3">
              <QuickQuery 
                icon={TrendingUp} 
                text="Tóm tắt sức khỏe thương hiệu hiện tại" 
                onClick={handleSend}
              />
              <QuickQuery 
                icon={Target} 
                text="Tại sao chi nhánh Đà Nẵng bị khách chê?" 
                onClick={handleSend}
              />
              <QuickQuery 
                icon={MessageSquare} 
                text="Gợi ý cách cải thiện dịch vụ tại quầy" 
                onClick={handleSend}
              />
              <QuickQuery 
                icon={RefreshCw} 
                text="So sánh hiệu suất với đối thủ Katinat" 
                onClick={handleSend}
              />
            </div>
          </div>

          <div className="bg-[#B22830] p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest">AI Capability</h4>
              <p className="text-xs font-medium text-red-100 leading-relaxed italic">
                "Tôi có thể phân tích dữ liệu CRM từ n8n, so sánh các chỉ số Churn Risk và đưa ra lộ trình hành động cụ thể cho từng chi nhánh."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultantPage;
