import React from 'react';
import { FaUsers } from 'react-icons/fa';

const UsersTab = ({ usersData, usersLoading }) => {
  return (
    <div className="pu-tab-content-royal">
      <div className="pu-section-header-royal">
        <h2><FaUsers /> User Repository</h2>
      </div>

      {usersLoading ? (
        <div className="pu-loading-royal">Accessing user records...</div>
      ) : (
        <div className="pu-table-container-royal">
          <table className="pu-royal-data-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ORDERS</th>
              </tr>
            </thead>
            <tbody>
              {(usersData || []).map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.total_orders || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
