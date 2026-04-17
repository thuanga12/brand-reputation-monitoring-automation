import mongoose from "mongoose";

const crmSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true, unique: true },
    total_reviews: { type: Number, default: 0 },
    avg_rating: { type: Number, default: 0 },
    churn_risk_rate: { type: Number, default: 0 }, // Tỉ lệ rủi ro rời bỏ (0-100)
    loyalty_score: { type: Number, default: 0 },
    retention_action: { type: String, default: "Chưa có đề xuất" },
    recovery_action: { type: String, default: "Chưa có đề xuất" },
    last_interaction: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("CRM", crmSchema);