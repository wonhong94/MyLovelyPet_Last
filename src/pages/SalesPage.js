// src/pages/SalesPage.js
import React from 'react';
import MonthlySalesChart from '../components/MonthlySalesChart';

import './SalesPage.css';

function SalesPage() {
  return (
    <div className="sales-page">
      <div className="content">
        <MonthlySalesChart />
        
      </div>
    </div>
  );
}

export default SalesPage;