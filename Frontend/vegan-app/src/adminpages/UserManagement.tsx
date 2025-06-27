import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/admin/users').then(res => setUsers(res.data));
  }, []);

  const deleteUser = (id: number) => {
    axios.delete(`http://localhost:5000/admin/user/delete/${id}`).then(() => {
      setUsers(users.filter((u: any) => u.id !== id));
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Navbar - untouched */}
      <nav className="navbar navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          <button
            className="btn d-flex align-items-center p-0 border-0 bg-transparent"
            onClick={handleGoBack}
            style={{ textDecoration: 'none' }}
          >
            <i className="bi bi-arrow-left-circle text-success" style={{ fontSize: '1.8rem' }}></i>
            <span
              className="ms-2"
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#28a745',
              }}
            >
              Veganify
            </span>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div
        className="container"
        style={{
          maxWidth: '900px',
          marginTop: '100px',
          padding: '0 20px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2
          className="text-center mb-5"
          style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: '#2e2e2e',
            letterSpacing: '0.03em',
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          User Management
        </h2>

        <div className="list-group">
          {users.map((user: any) => (
            <div
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                borderRadius: '12px',
                marginBottom: '15px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
                backgroundColor: '#fff',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.transform = 'translateY(-3px)';
                target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
              }}
            >
              <div
                className="d-flex flex-column"
                style={{
                  fontSize: '1.1rem',
                  color: '#444',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontWeight: 600 }}>{user.userName}</span>
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {user.email}
                </span>
              </div>

              <button
                onClick={() => deleteUser(user.id)}
                className="btn btn-danger btn-sm"
                style={{
                  backgroundColor: '#dc3545',
                  borderColor: '#dc3545',
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(220, 53, 69, 0.4)',
                  transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget;
                  btn.style.backgroundColor = '#b02a37';
                  btn.style.boxShadow = '0 4px 12px rgba(176, 42, 55, 0.6)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget;
                  btn.style.backgroundColor = '#dc3545';
                  btn.style.boxShadow = '0 2px 6px rgba(220, 53, 69, 0.4)';
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserManagement;
