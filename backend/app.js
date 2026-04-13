import express from "express";
import cors from "cors";

// Import các route đã chia cho từng bạn
import reviewRoutes from "./routes/review.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";
import competitorRoutes from "./routes/competitor.routes.js";
import crmRoutes from "./routes/crm.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import reviewHighlandRoutes from "./routes/reviewHighland.routes.js";

app.use("/api/reviews", reviewRoutes);
app.use("/api/reviews-highland", reviewHighlandRoutes);
const app = express();

app.use(cors());
app.use(express.json());

// Route kiểm tra hệ thống
app.get("/", (req, res) => {
  res.json({ message: "Highlands Admin Backend is running" });
});

// Gắn các route vào app
app.use("/api/reviews", reviewRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/competitors", competitorRoutes);
app.use("/api/crm", crmRoutes);

export default app; // Dòng này cực kỳ quan trọng để server.js có thể dùng được app