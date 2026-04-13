import mongoose from "mongoose";

const crmSchema = new mongoose.Schema(
  {
    branch_name: String,
    report_month: String,
    churn_risk_rate: String,
    churn_reason: String,
    customer_segment: String,
    loyalty_hook: String,
    recovery_action: String,
    retention_action: String,
  },
  { timestamps: true }
);

// Xuất mặc định để Controller có thể import
export default mongoose.model("CRM", crmSchema);