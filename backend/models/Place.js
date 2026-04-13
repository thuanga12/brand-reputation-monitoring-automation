import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    place_id: String,
    data_id: String,
    title: String,         // Đã sửa cho khớp với DB
    address: String,
    gps: String,           // Lưu chuỗi tọa độ từ n8n
    rating: Number,
    reviews_count: Number, // Đã sửa cho khớp với DB
    source: String,
    updated_at: String     // Cột thời gian từ n8n
  },
  { 
    // Tắt timestamps mặc định của mongoose vì n8n đã tự đẩy updated_at vào rồi
    timestamps: false 
  }
);

// Mongoose sẽ tự động map cái này vào collection "places" trong n8n_db
export default mongoose.model("Place", placeSchema);