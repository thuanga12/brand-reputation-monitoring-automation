import express from "express";
import cors from "cors";

import reviewRoutes from "./routes/review.routes.js";
import reviewHighlandRoutes from "./routes/reviewHighland.routes.js";
// Import file route đối thủ vào đây
import competitorRoutes from "./routes/competitor.routes.js"; 

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/reviews", reviewRoutes);
app.use("/api/reviews-highland", reviewHighlandRoutes);

// MỞ KHÓA DÒNG NÀY ĐỂ API HOẠT ĐỘNG
app.use("/api/competitors", competitorRoutes); 

export default app;