import React, { useMemo } from "react";

import {

  ResponsiveContainer,

  PieChart,

  Pie,

  Cell,

  Tooltip,

  BarChart,

  Bar,

  XAxis,

  YAxis,

  CartesianGrid,

  Legend,

} from "recharts";



const COLORS = ["#22c55e", "#94a3b8", "#ef4444"];



export default function DashboardCharts({ allData = [], stats }) {

  // Biểu đồ tròn dùng stats (ĐÃ TÍNH TRÊN TOÀN BỘ DỮ LIỆU Ở FILE PAGE)

  const sentimentData = useMemo(

    () => [

      { name: "Tích cực", value: stats?.positiveCount || 0 },

      { name: "Trung lập", value: stats?.neutralCount || 0 },

      { name: "Tiêu cực", value: stats?.negativeCount || 0 },

    ],

    [stats] // Khi stats thay đổi, biểu đồ tròn sẽ nhảy theo đúng con số trên Card

  );



  // Biểu đồ cột dùng allData (Dữ liệu tổng đã lọc)

  const categoryData = useMemo(() => {

    const map = {};

    // Lọc bỏ Trung lập để biểu đồ cột không bị cột "Khác" quá cao

    allData.forEach((item) => {

      if (item.sentiment !== "Trung lập") {

        const key = item.category || "Khác";

        map[key] = (map[key] || 0) + 1;

      }

    });



    return Object.entries(map)

      .map(([name, value]) => ({ name, value }))

      .sort((a, b) => b.value - a.value);

  }, [allData]);



  return (

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[360px]">

        <h3 className="text-2xl font-semibold mb-6">Phân bố cảm xúc</h3>

        <div className="h-[280px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie

                data={sentimentData}

                dataKey="value"

                nameKey="name"

                outerRadius={100}

                label

              >

                {sentimentData.map((_, index) => (

                  <Cell key={index} fill={COLORS[index % COLORS.length]} />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>



      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[360px]">

        <h3 className="text-2xl font-semibold mb-6">Đánh giá theo danh mục</h3>

        <div className="h-[280px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={categoryData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar dataKey="value" fill="#B22830" radius={[8, 8, 0, 0]} />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}