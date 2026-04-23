import React, { useEffect, useMemo, useState } from "react";
import DashboardStats from "../../components/DashboardStats";
import DashboardCharts from "../../components/DashboardCharts";
import DashboardTable from "../../components/DashboardTable";
import { getHighlandReviews } from "../../api/reviewApi";

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]); 
  const [allReviewsForFilter, setAllReviewsForFilter] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    sentiment: "",
    is_crisis: "",
    address: "" // State lọc địa chỉ đồng bộ với server
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [resPaging, resFull] = await Promise.all([
          getHighlandReviews({
            page,
            limit,
            ...(filters.sentiment ? { sentiment: filters.sentiment } : {}),
            ...(filters.is_crisis !== "" ? { is_crisis: filters.is_crisis } : {}),
            ...(filters.address ? { address: filters.address } : {}) // Gửi địa chỉ lên server
          }),
          getHighlandReviews({ limit: 1000 }) 
        ]);

        setReviews(resPaging.items || []);
        setAllReviewsForFilter(resFull.items || resFull || []);
        
        setPagination({
          total: resPaging.total || 0,
          totalPages: resPaging.totalPages || 0,
          page: resPaging.page || 1,
          limit: resPaging.limit || 10,
        });
      } catch (error) {
        console.error("Lỗi load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [page, limit, filters]);

const stats = useMemo(() => {
  // Ưu tiên tính trên 1000 mẫu để con số thống kê là khách quan nhất
  const targetData = allReviewsForFilter.length > 0 ? allReviewsForFilter : reviews;

  const positiveCount = targetData.filter(item => item.sentiment === "Tích cực").length;
  const neutralCount = targetData.filter(item => item.sentiment === "Trung lập").length;
  const negativeCount = targetData.filter(item => item.sentiment === "Tiêu cực").length;
  const crisisCount = targetData.filter(item => item.is_crisis === true).length;

  const positiveRate = targetData.length > 0 
    ? ((positiveCount / targetData.length) * 100).toFixed(1) 
    : 0;

  const avgRating = targetData.length > 0 
    ? (targetData.reduce((sum, item) => sum + (item.rating || 0), 0) / targetData.length).toFixed(1) 
    : 0;

  return {
    totalReviews: pagination.total, // Tổng từ DB
    positiveCount, neutralCount, negativeCount, positiveRate, avgRating, crisisCount
  };
}, [allReviewsForFilter, reviews, pagination.total]);

  // Hàm xử lý khi thay đổi chi nhánh ở file con
  const handleBranchChange = (newAddress) => {
    setPage(1); // Reset về trang 1 khi lọc chi nhánh mới
    setFilters(prev => ({ ...prev, address: newAddress }));
  };

  const handlePrevPage = () => page > 1 && setPage(p => p - 1);
  const handleNextPage = () => page < pagination.totalPages && setPage(p => p + 1);

  if (loading) return <div className="p-6 font-bold text-slate-400">ĐANG ĐỒNG BỘ HỆ THỐNG...</div>;

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
          <select 
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none"
            value={filters.sentiment} 
            onChange={(e) => { setPage(1); setFilters(f => ({...f, sentiment: e.target.value})); }}
          >
            <option value="">Tất cả cảm xúc</option>
            <option value="Tích cực">Tích cực</option>
            <option value="Trung lập">Trung lập</option>
            <option value="Tiêu cực">Tiêu cực</option>
          </select>

          <select
            className="border border-slate-300 rounded-xl px-4 py-2 text-sm"
            value={filters.is_crisis}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({
                ...prev,
                is_crisis: e.target.value,
              }));
            }}
          >
            <option value="">Tất cả mức độ</option>
            <option value="true">Khủng hoảng</option>
            <option value="false">Không khủng hoảng</option>
          </select>

          <select
            className="border border-slate-300 rounded-xl px-4 py-2 text-sm"
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
          >
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
        </div>
      </div>
<DashboardCharts allData={allReviewsForFilter} stats={stats} />
      
      {/* TRUYỀN THÊM PROPS LỌC XUỐNG FILE CON */}
      <DashboardTable 
        reviews={reviews} 
        allData={allReviewsForFilter} 
        currentBranch={filters.address} 
        onBranchChange={handleBranchChange} 
      />

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center">
        <div className="text-sm text-slate-500 font-medium">
          Trang {pagination.page} / {pagination.totalPages} — {pagination.total} Review
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevPage} disabled={page === 1} className="px-4 py-2 border rounded-xl disabled:opacity-30">Trang trước</button>
          <button onClick={handleNextPage} disabled={page === pagination.totalPages} className="px-4 py-2 bg-[#B22830] text-white rounded-xl disabled:opacity-30">Trang sau</button>
        </div>
      </div>
    </div>
  );
}