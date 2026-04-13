import mongoose from "mongoose";

const competitorSchema = new mongoose.Schema(
  {
    brand: String,
    service_score: Number,
    product_score: Number,
    vibe_score: Number,
    positive_rate: Number,
    negative_rate: Number,
    key_strengths: [String],
    painpoints: [String],
  },
  { timestamps: true }
);

// Xuất mặc định để các file khác có thể import
export default mongoose.model("Competitor", competitorSchema);