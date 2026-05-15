import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const CompetitorRadar = ({ competitors }) => {
  const data = {
    labels: ['Dịch vụ', 'Sản phẩm', 'Không gian (Vibe)', 'Tỉ lệ Tích cực'],
    datasets: competitors.map((brand, index) => ({
      label: brand.brand_name,
      data: [
        brand.service_score, 
        brand.product_score, 
        brand.vibe_score, 
        brand.positive_rate * 10 // Nhân 10 để cùng thang điểm với score
      ],
      backgroundColor: index === 0 ? 'rgba(191, 30, 46, 0.2)' : 'rgba(54, 162, 235, 0.2)',
      borderColor: index === 0 ? '#BF1E2E' : '#36A2EB', // Highlands màu đỏ đặc trưng
    }))
  };

  return <Radar data={data} />;
};