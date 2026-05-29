import React from 'react';

const DashboardHeader = ({ selectedPeriod, setSelectedPeriod, userName }) => {
  const getInitials = (name) => {
    if (!name) return 'A';
    if (name.includes('@')) return name[0].toUpperCase();
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="admin-main-header">
      <div className="admin-period-selector">
        <label>Overview Period:</label>
        <select 
          className="admin-period-select" 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="1y">Yearly</option>
        </select>
      </div>
      <div className="header-user-info">
        <div className="user-avatar-gold">{getInitials(userName)}</div>
        <div className="user-meta">
          <span className="name">{userName || 'Admin'}</span>
          <span className="role">System Administrator</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
