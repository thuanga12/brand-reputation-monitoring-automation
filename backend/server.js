import dotenv from "dotenv";
import app from "./app.js"; // Import đúng file app.js ở trên
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Gọi hàm kết nối MongoDB Atlas mà bạn B phụ trách
    await connectDB(); 
    
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Lỗi khởi động server:", error.message);
    process.exit(1);
  }
};

startServer();