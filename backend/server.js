import dotenv from "dotenv";
import app from "./app.js"; 
import { connectDB } from "./config/db.js";
import crmRoutes from "./routes/crm.route.js"; // Đã import


dotenv.config();

const PORT = process.env.PORT || 5000;

// KÍCH HOẠT ROUTE CỦA BẠN C
// Lưu ý: Dòng này phải nằm TRƯỚC khi startServer
app.use("/api/crm", crmRoutes); 

const startServer = async () => {
  try {
    await connectDB(); 
    
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`🚀 API Phê duyệt của bạn C: http://localhost:${PORT}/api/crm/approve-reply/:id`);
    });
  } catch (error) {
    console.error("❌ Lỗi khởi động server:", error.message);
    process.exit(1);
  }
};

startServer();