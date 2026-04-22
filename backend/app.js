import express from "express";
import cors from "cors";

import reviewRoutes from "./routes/review.routes.js";
import reviewHighlandRoutes from "./routes/reviewHighland.routes.js";
// Import file route đối thủ vào đây
import competitorRoutes from "./routes/competitor.routes.js"; 
import authRoutes from "./routes/authRoutes.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ĐƯA 2 DÒNG NÀY LÊN ĐẦU (Xóa dòng express.json() cũ đi)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Các Route nằm ở dưới
app.use("/api/reviews", reviewRoutes);
app.use("/api/reviews-highland", reviewHighlandRoutes);
app.use('/api/auth', authRoutes); 
app.use("/api/competitors", competitorRoutes); 

export default app;