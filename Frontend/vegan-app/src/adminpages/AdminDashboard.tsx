import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/admin/dashboard').then(res => {
      setData(res.data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e9f7ef',
    borderRadius: '12px',
    padding: '10px 15px',
    marginBottom: '15px',
    color: '#155724',
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '10px',
    fontSize: '1.2rem'
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: '230px',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          padding: '30px 20px',
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px'
        }}
      >
        <h3 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '40px' }}>🌿 Veganify</h3>

        <div
          style={navItemStyle}
          onClick={() => navigate('/admin/dashboard')}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#d4edda'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#e9f7ef'}
        >
          <span style={iconStyle}>📊</span> Dashboard
        </div>

        <div
          style={navItemStyle}
          onClick={() => navigate('/admin/users')}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#d4edda'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#e9f7ef'}
        >
          <span style={iconStyle}>👤</span> User Management
        </div>

        <div
          style={navItemStyle}
          onClick={() => navigate('/admin/classifications')}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#d4edda'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#e9f7ef'}
        >
          <span style={iconStyle}>🍛</span> Classification History
        </div>

        <div
          style={{
            ...navItemStyle,
            backgroundColor: '#f8d7da',
            color: '#721c24'
          }}
          onClick={handleLogout}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5c6cb'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#f8d7da'}
        >
          <span style={iconStyle}>🔓</span> Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Navbar */}
        <div className="bg-white p-3 mb-4 rounded shadow-sm d-flex justify-content-between align-items-center">
          <h4 className="m-0" style={{ color: "#28a745" }}>Admin Dashboard</h4>
        </div>

        {/* Overview Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <h5 style={{ color: '#555' }}>Total Users</h5>
              <h3 style={{ color: '#28a745', fontWeight: 'bold' }}>{data.total_users}</h3>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <h5 style={{ color: '#555' }}>Total Classifications</h5>
              <h3 style={{ color: '#28a745', fontWeight: 'bold' }}>{data.total_predictions}</h3>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h5 style={{ marginBottom: '20px', color: '#333' }}>Recent Activity</h5>
          <ul className="list-group">
            {data.recent_activity?.map((item: any) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={item.id}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #eee',
                  padding: '12px 0'
                }}
              >
                <div>
                  <strong style={{ color: "#343a40" }}>{item.user_name}</strong>: {item.result}
                </div>
                <small className="text-muted">{item.created_at}</small>
              </li>
            ))}
            {data.recent_activity?.length === 0 && (
              <li className="list-group-item text-muted">No recent activity</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
