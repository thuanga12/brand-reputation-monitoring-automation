import React, { useState, useEffect } from "react";
import axios from "axios";

const DashboardPage = () => {
  // 1. Tạo state để lưu dữ liệu từ API
  const [stats, setStats] = useState({
    total_reviews: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    crisis: 0,
  });
  const [loading, setLoading] = useState(true);

  // 2. Gọi API ngay khi trang vừa load xong
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/statistics");
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi gọi API Thống kê:", error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []); // Mảng rỗng [] giúp API chỉ gọi 1 lần khi render

  // 3. Hiển thị lúc đang chờ dữ liệu
  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Đang tải dữ liệu...</div>;

  // 4. Giao diện (A có thể tự thêm CSS/Tailwind để giống thiết kế của nhóm nhé)
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>📊 Tổng Quan Thương Hiệu Highlands</h2>
      
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Thẻ Tổng Review */}
        <div style={cardStyle}>
          <h3>Tổng Đánh Giá</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.total_reviews}</p>
        </div>

        {/* Thẻ Tích Cực */}
        <div style={{ ...cardStyle, borderTop: "4px solid green" }}>
          <h3>Tích Cực 😊</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "green" }}>{stats.positive}</p>
        </div>

        {/* Thẻ Tiêu Cực */}
        <div style={{ ...cardStyle, borderTop: "4px solid orange" }}>
          <h3>Tiêu Cực 😠</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "orange" }}>{stats.negative}</p>
        </div>

        {/* Thẻ Cảnh Báo Khủng Hoảng */}
        <div style={{ ...cardStyle, borderTop: "4px solid red", backgroundColor: "#ffe6e6" }}>
          <h3>Cảnh Báo Khủng Hoảng 🚨</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "red" }}>{stats.crisis}</p>
        </div>
      </div>
    </div>
  );
};

// CSS mẫu viết inline (A nên chuyển sang file CSS riêng hoặc dùng Tailwind nhé)
const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  backgroundColor: "#fff"
};

export default DashboardPage;