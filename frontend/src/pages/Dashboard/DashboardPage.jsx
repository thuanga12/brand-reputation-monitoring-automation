import React, { useEffect, useMemo, useState } from "react";
import DashboardStats from "../../components/DashboardStats";
import DashboardCharts from "../../components/DashboardCharts";
import DashboardTable from "../../components/DashboardTable";
import { getHighlandReviews } from "../../api/reviewApi";

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]);
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
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const res = await getHighlandReviews({
          page,
          limit,
          ...(filters.sentiment ? { sentiment: filters.sentiment } : {}),
          ...(filters.is_crisis !== "" ? { is_crisis: filters.is_crisis } : {}),
        });

        console.log("Highland reviews:", res);

        setReviews(res.items || []);
        setPagination({
          total: res.total || 0,
          totalPages: res.totalPages || 0,
          page: res.page || 1,
          limit: res.limit || 10,
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
    const totalReviews = pagination.total;

    const positiveCount = reviews.filter(
      (item) => item.sentiment === "Tích cực"
    ).length;

    const neutralCount = reviews.filter(
      (item) => item.sentiment === "Trung lập"
    ).length;

    const negativeCount = reviews.filter(
      (item) => item.sentiment === "Tiêu cực"
    ).length;

    const crisisCount = reviews.filter((item) => item.is_crisis).length;

    const positiveRate =
      reviews.length > 0
        ? ((positiveCount / reviews.length) * 100).toFixed(1)
        : 0;

    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, item) => sum + (item.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    return {
      totalReviews,
      positiveCount,
      neutralCount,
      negativeCount,
      crisisCount,
      positiveRate,
      avgRating,
    };
  }, [reviews, pagination.total]);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <DashboardStats stats={stats} />

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
<div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Bộ lọc:</span>

          <select
            className="border border-slate-300 rounded-xl px-4 py-2 text-sm"
            value={filters.sentiment}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({
                ...prev,
                sentiment: e.target.value,
              }));
            }}
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

      <DashboardCharts reviews={reviews} stats={stats} />
      <DashboardTable reviews={reviews} />

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-slate-600">
          Hiển thị trang <strong>{pagination.page}</strong> /{" "}
          <strong>{pagination.totalPages}</strong> — Tổng{" "}
          <strong>{pagination.total}</strong> review
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-300 text-sm disabled:opacity-50"
          >
            Trang trước
          </button>

          <button
            onClick={handleNextPage}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 rounded-xl bg-[#B22830] text-white text-sm disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
