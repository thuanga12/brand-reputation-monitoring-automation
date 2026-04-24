import React, { useMemo } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#94a3b8", "#ef4444"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100">
        <p className="text-sm font-semibold text-slate-700">
          {payload[0].name}
        </p>
        <p className="text-sm text-slate-500">
          {payload[0].value} đánh giá
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({ allData = [], stats }) {
  const sentimentData = useMemo(() => [
    { name: "Tích cực", value: stats?.positiveCount || 0 },
    { name: "Trung lập", value: stats?.neutralCount || 0 },
    { name: "Tiêu cực", value: stats?.negativeCount || 0 },
  ], [stats]);

  const total = sentimentData.reduce((sum, i) => sum + i.value, 0);

  const categoryData = useMemo(() => {
    const map = {};
    const categoryMapping = {
      "Complaint_service": "Dịch vụ",
      "Complaint_delivery": "Giao hàng",
      "Feedback_negative": "Tiêu cực",
      "Feature_request": "Góp ý",
      "Other": "Khác",
      "feedback_positive": "Tích cực"
    };

    allData.forEach((item) => {
      const s = (item.sentiment || "").toLowerCase().trim();
      if (s !== "trung lập") {
        let raw = (item.category || "Khác").trim();
        let clean = categoryMapping[raw] || raw;
        clean = clean.charAt(0).toUpperCase() + clean.slice(1);
        map[clean] = (map[clean] || 0) + 1;
      }
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allData]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

      {/* PIE CHART */}
      <div className="relative bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">
          Phân bổ cảm xúc
        </h3>

        <div className="h-[320px] relative">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={6}
                stroke="none"
              >
                {sentimentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER INFO */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-sm text-slate-400">Tổng</p>
            <h2 className="text-2xl font-bold text-slate-800">
              {total}
            </h2>
          </div>
        </div>

        {/* LEGEND CUSTOM */}
        <div className="flex justify-center gap-6 mt-4">
          {sentimentData.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: COLORS[i] }}
              />
              {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">
          Đánh giá theo danh mục
        </h3>

        <div className="h-[320px]">
          <ResponsiveContainer>
            <BarChart
              data={categoryData}
              margin={{ top: 10, right: 10, left: -20, bottom: 50 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                angle={-40}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b" }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="value"
                radius={[10, 10, 0, 0]}
                barSize={30}
              >
                {categoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill="url(#gradient)"
                  />
                ))}
              </Bar>

              {/* GRADIENT */}
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B22830" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}