import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI not found in .env file");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Thêm dòng này để kiểm tra xem có đúng là n8n_db không
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`); 

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};