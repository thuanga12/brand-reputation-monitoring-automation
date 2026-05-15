import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Filter, Calendar, MapPin, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axios';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('05/2026'); // Mặc định theo mẫu
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/crm/reports');
        if (response.data.success) {
          setReports(response.data.data);
          // Cập nhật tháng mới nhất từ dữ liệu nếu có
          if (response.data.data.length > 0) {
            setSelectedMonth(response.data.data[0].report_month);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const branches = ['all', ...new Set(reports.map(r => r.branch_name).filter(Boolean))];
  const months = [...new Set(reports.map(r => r.report_month).filter(Boolean))];

  const filteredReports = reports.filter(r => 
    (selectedBranch === 'all' || r.branch_name === selectedBranch) &&
    (r.report_month === selectedMonth)
  );

  const aggregateData = (data) => {
    if (data.length === 0) return null;
    if (selectedBranch !== 'all') return data[0];

    // Tính toán dữ liệu cho báo cáo tổng
    const avgChurn = Math.round(data.reduce((acc, curr) => acc + parseFloat(curr.churn_risk_rate || 0), 0) / data.length);
    const maxChurnBranch = [...data].sort((a, b) => parseFloat(b.churn_risk_rate || 0) - parseFloat(a.churn_risk_rate || 0))[0];

    return {
      branch_name: "Hệ thống Highlands Coffee khu vực Đà Nẵng",
      report_month: selectedMonth === 'all' ? "Tất cả kỳ báo cáo hiện có" : selectedMonth,
      avg_churn: avgChurn + "%",
      max_churn_branch: maxChurnBranch.branch_name,
      max_churn_rate: maxChurnBranch.churn_risk_rate,
      branches: data,
      isSummary: true
    };
  };

  const reportData = aggregateData(filteredReports);

  const handleExportWord = () => {
    const content = document.getElementById('printable-report').innerHTML;
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.5; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          .italic { font-style: italic; }
          .text-right { text-align: right; }
          .space-y-4 > * + * { margin-top: 10px; }
          ul { list-style-type: disc; margin-left: 20px; }
        </style>
      </head>
      <body>
    `;
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bao_cao_Highlands_${selectedBranch === 'all' ? 'Tong_hop' : selectedBranch}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-[#B22830]" /> Trung tâm Báo cáo
          </h2>
          <p className="text-slate-500">Quản lý và xuất báo cáo quản trị khách hàng chuyên nghiệp</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <MapPin size={16} className="text-slate-400" />
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
            >
              <option value="all">Tất cả chi nhánh</option>
              {branches.filter(b => b !== 'all').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
            >
              {months.length > 0 ? months.map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              )) : <option value="05/2026">Tháng 05/2026</option>}
            </select>
          </div>

          <button 
            onClick={handleExportWord}
            className="flex items-center gap-2 bg-[#B22830] text-white px-5 py-2 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
          >
            <Download size={18} />
            Tải File Word
          </button>
        </div>
      </div>

      {/* Main Report Document */}
      <div className="flex justify-center pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p>Đang tải dữ liệu báo cáo...</p>
          </div>
        ) : reportData ? (
          <div 
            id="printable-report"
            className="bg-white w-full max-w-[850px] min-h-[1100px] shadow-2xl p-[60px] md:p-[80px] text-black font-serif relative overflow-hidden print:shadow-none print:p-0"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {/* National Header */}
            <div className="text-center mb-8">
              <h3 className="font-bold text-[15pt] uppercase leading-tight">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
              <h4 className="font-bold text-[14pt] mb-1">Độc lập - Tự do - Hạnh phúc</h4>
              <div className="w-40 h-[1px] bg-black mx-auto mb-4"></div>
              <p className="italic text-[12pt] text-right">Đà Nẵng, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
              <h2 className="font-bold text-[18pt] uppercase leading-tight">BÁO CÁO TỔNG KẾT</h2>
              <h2 className="font-bold text-[16pt] uppercase leading-tight">
                CÔNG TÁC QUẢN TRỊ KHÁCH HÀNG TẠI {reportData.isSummary ? 'CÁC CHI NHÁNH HIGHLANDS COFFEE KHU VỰC ĐÀ NẴNG' : reportData.branch_name.toUpperCase()}
              </h2>
            </div>

            {/* Info Section */}
            <div className="space-y-2 mb-8 text-[13pt]">
              <p><span className="font-bold">Đơn vị báo cáo:</span> {reportData.isSummary ? 'Hệ thống Highlands Coffee khu vực Đà Nẵng' : reportData.branch_name}</p>
              <p><span className="font-bold">Thời gian báo cáo:</span> {reportData.report_month}</p>
            </div>

            {/* Body */}
            <div className="text-[13pt] leading-relaxed text-justify space-y-6">
              <p className="font-bold italic">Tình hình thực hiện công tác quản trị khách hàng trong kỳ báo cáo như sau:</p>
              
              {reportData.isSummary ? (
                <div className="space-y-4">
                  <p>1. <span className="font-bold">Về phạm vi báo cáo:</span> Hệ thống đã tổng hợp dữ liệu quản trị khách hàng từ các báo cáo CRM hiện có của Highlands Coffee tại khu vực Đà Nẵng trong kỳ báo cáo được chọn.</p>
                  
                  <p>2. <span className="font-bold">Về mức độ rủi ro rời bỏ:</span> Tỷ lệ churn risk trung bình đạt <span className="font-bold text-red-600">{reportData.avg_churn}</span>. Chi nhánh có mức rủi ro cao nhất là <span className="font-bold text-red-600">{reportData.max_churn_branch}</span> với tỷ lệ <span className="font-bold text-red-600">{reportData.max_churn_rate}</span>.</p>
                  
                  <p>3. <span className="font-bold">Về nguyên nhân chính:</span> Các nguyên nhân rời bỏ thường liên quan đến thời gian chờ đợi, chất lượng phục vụ, trải nghiệm không gian và mức độ thuận tiện trong quá trình mua hàng.</p>
                  
                  <p>4. <span className="font-bold">Về định hướng hành động:</span> Hệ thống cần triển khai đồng thời các hoạt động phục hồi khách hàng có nguy cơ rời bỏ và các chiến dịch giữ chân khách hàng trung thành.</p>

                  <div className="pt-6">
                    <p className="font-bold uppercase mb-4">Danh sách báo cáo chi nhánh được tổng hợp:</p>
                    {reportData.branches.map((branch, index) => (
                      <div key={index} className="mb-6">
                        <p className="font-bold">{index + 1}. {branch.branch_name}</p>
                        <ul className="list-disc pl-8 space-y-1 mt-2">
                          <li><span className="font-bold">Tỷ lệ nguy cơ rời bỏ:</span> {branch.churn_risk_rate}</li>
                          <li><span className="font-bold">Nguyên nhân:</span> {branch.churn_reason}</li>
                          <li><span className="font-bold">Nhóm khách hàng trọng tâm:</span> {branch.customer_segment}</li>
                          <li><span className="font-bold">Biện pháp phục hồi:</span> {branch.recovery_action}</li>
                          <li><span className="font-bold">Biện pháp giữ chân:</span> {branch.retention_action}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>1. <span className="font-bold">Về tình hình chung:</span> Trong kỳ báo cáo {reportData.report_month}, {reportData.branch_name} ghi nhận tỷ lệ nguy cơ rời bỏ khách hàng ở mức <span className="font-bold text-red-600">{reportData.churn_risk_rate}</span>.</p>
                  
                  <p>2. <span className="font-bold">Về nguyên nhân rời bỏ:</span> {reportData.churn_reason}</p>
                  
                  <p>3. <span className="font-bold">Về nhóm khách hàng trọng tâm:</span> {reportData.customer_segment}</p>
                  
                  <p>4. <span className="font-bold">Về điểm mạnh giữ chân khách hàng:</span> {reportData.loyalty_hook}</p>
                  
                  <p>5. <span className="font-bold">Về biện pháp phục hồi:</span> {reportData.recovery_action}</p>
                  
                  <p>6. <span className="font-bold">Về biện pháp duy trì khách hàng trung thành:</span> {reportData.retention_action}</p>
                  
                  <div className="space-y-2">
                    <p className="font-bold">Các hành động đề xuất:</p>
                    <ul className="list-disc pl-8 space-y-2">
                      <li><span className="font-bold">Biện pháp phục hồi:</span> {reportData.recovery_action}</li>
                      <li><span className="font-bold">Biện pháp giữ chân:</span> {reportData.retention_action}</li>
                    </ul>
                  </div>

                  <p>7. <span className="font-bold">Đề xuất:</span> Chi nhánh cần tiếp tục theo dõi phản hồi khách hàng, cải thiện các điểm chạm trong quá trình phục vụ, đồng thời triển khai các chương trình chăm sóc phù hợp nhằm gia tăng tỷ lệ quay lại và giảm nguy cơ rời bỏ trong các kỳ tiếp theo.</p>
                </div>
              )}
            </div>

            {/* Signature Area */}
            <div className="mt-20 flex justify-between text-center px-10 mb-10">
              <div className="space-y-20">
                <p className="font-bold uppercase">XÁC NHẬN CỦA ĐƠN VỊ</p>
                <p className="italic text-sm">(Ký, ghi rõ họ tên)</p>
              </div>
              <div className="space-y-20">
                <p className="font-bold uppercase">NGƯỜI LẬP BÁO CÁO</p>
                <p className="italic text-sm">(Ký, ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white w-full max-w-[850px] min-h-[400px] shadow-lg rounded-[32px] flex flex-center flex-col items-center justify-center p-20 text-center border border-slate-100">
            <Filter size={64} className="text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy dữ liệu báo cáo</h3>
            <p className="text-slate-500 max-w-sm">Dữ liệu cho chi nhánh và tháng này hiện chưa có sẵn. Vui lòng chọn thời gian hoặc chi nhánh khác.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          #printable-report { 
            box-shadow: none !important; 
            margin: 0 !important; 
            max-width: 100% !important; 
            width: 100% !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          @page { size: A4; margin: 20mm; }
        }
      `}} />
    </div>
  );
};

export default ReportPage;
