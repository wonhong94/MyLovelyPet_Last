// src/chart.js

// Chart.js에서 필요한 모듈을 가져옵니다.
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement, LineController } from 'chart.js';

// Chart.js에 모듈을 등록합니다.
Chart.register(
  CategoryScale,   // 카테고리 스케일
  LinearScale,     // 선형 스케일
  Title,           // 차트 제목
  Tooltip,         // 툴팁
  Legend,          // 범례
  LineElement,     // 라인 엘리먼트
  PointElement,    // 포인트 엘리먼트
  LineController   // 라인 컨트롤러
);

// 필요한 경우 Chart.js의 글로벌 설정을 수정할 수 있습니다.
// 예: Chart.defaults.font.size = 16;

export default Chart;
