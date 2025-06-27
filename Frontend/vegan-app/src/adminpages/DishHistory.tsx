import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DishHistory: React.FC = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/admin/classifications')
      .then((res) => setEntries(res.data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Navbar */}
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
                fontSize: '1.6rem',
                fontWeight: '700',
                color: '#28a745',
                letterSpacing: '1px',
              }}
            >
              Veganify
            </span>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container" style={{ marginTop: '90px', marginBottom: '40px' }}>
        <h2
          className="mb-4 text-center"
          style={{ fontWeight: '700', color: '#2c3e50', letterSpacing: '1.2px' }}
        >
          Dish Classification History
        </h2>

        {entries.length === 0 ? (
          <p className="text-center fst-italic text-muted mt-5">No classification history available.</p>
        ) : (
          <div className="table-responsive shadow rounded">
            <table
              className="table table-striped table-hover align-middle"
              style={{ backgroundColor: '#f9f9f9' }}
            >
              <thead className="table-success">
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Username</th>
                  <th scope="col">Image</th>
                  <th scope="col">Result</th>
                  <th scope="col">Labels</th>
                  <th scope="col">Feedback</th>
                  <th scope="col">Created At</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((item: any) => (
                  <tr key={item.id} style={{ cursor: 'default' }}>
                    <td style={{ fontWeight: '600', color: '#34495e' }}>{item.user_id || 'N/A'}</td>
                    <td style={{ fontWeight: '600', color: '#34495e' }}>{item.userName || 'Anonymous'}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/image/${item.result_image_path}`}
                        alt="Dish result"
                        style={{
                          width: '100px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                        }}
                      />
                    </td>
                    <td
                      style={{
                        color:
                          item.result === 'Vegan'
                            ? '#27ae60'
                            : item.result === 'Non-Vegan'
                            ? '#c0392b'
                            : '#7f8c8d',
                        fontWeight: '700',
                      }}
                    >
                      {item.result}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: '#2d3436' }}>{item.labels}</td>
                    <td style={{ fontStyle: 'italic', color: '#636e72' }}>
                      {item.feedback || 'No feedback'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#95a5a6' }}>
                      {item.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default DishHistory;
