import mongoose from "mongoose";

const competitorSchema = new mongoose.Schema(
  {
    report_date: String,
    brand_name: String, // Trong data của bạn là brand_name, không phải brand
    total_reviews: Number,
    positive_rate: Number,
    negative_rate: Number,
    service_score: Number,
    product_score: Number,
    vibe_score: Number,
    new_launch: String,
    key_strengths: String, // Data mẫu là String dài, nếu để [String] sẽ bị lỗi mapping
    customer_painpoints: String, // Tên đúng trong schema bạn gửi
    vs_highlands: String,
    strategic_advice: String,
    action_items: String
  },
  { 
    timestamps: true,
    collection: 'sosanh' // Chỉ định rõ tên collection để tránh Mongoose tự thêm 's' vào cuối
  }
);

export default mongoose.model("Competitor", competitorSchema);