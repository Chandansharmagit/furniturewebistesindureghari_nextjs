import React from 'react';

const DashboardHeader = ({ selectedPeriod, setSelectedPeriod, userName }) => {
  return (
    <div className="admin-main-header">
      <div className="admin-period-selector">
        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="1y">Yearly</option>
        </select>
      </div>
      <div className="header-user-info">
        <span>{userName}</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
