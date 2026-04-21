import mongoose from "mongoose";

const crmSchema = new mongoose.Schema(
  {
    branch_name: { type: String }, 
    report_month: { type: String },
    churn_risk_rate: { type: String }, // % rủi ro rời bỏ từ n8n
    churn_reason: { type: String },
    customer_segment: { type: String },
    loyalty_hook: { type: String },
    retention_action: { type: String, default: "Chưa có đề xuất" },
    recovery_action: { type: String, default: "Chưa có đề xuất" },
  },
  { 
    // Ép buộc Model này đọc đúng dữ liệu từ collection 'quantrikhachhang' mà n8n đã tạo
    collection: 'quantrikhachhang', 
    timestamps: true 
  }
);

export default mongoose.model("CRM", crmSchema);