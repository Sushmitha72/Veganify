import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewHistory: React.FC = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.post('http://localhost:5000/history', { userId });
        if (res.data.success) {
          setHistory(res.data.history);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError('Failed to load history.');
      }
    };

    if (userId) fetchHistory();
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '420px',
    maxHeight: '550px',
    overflow: 'hidden',
    marginBottom: '20px',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  };

  const imageStyle: React.CSSProperties = {
    width: '180px',
    height: '180px',
    objectFit: 'cover' as const, // ✅ Fix for type error
    borderRadius: '8px',
  };

  return (
    <>
      {/* Top Navigation Bar */}
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

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '90px' }}>
        <h2 className="text-center mb-4 text-primary">Prediction History</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {history.length === 0 ? (
          <p className="text-muted text-center">No history found.</p>
        ) : (
          <div className="row">
            {history.map((entry: any, index) => (
              <div className="col-md-4 d-flex justify-content-center" key={index}>
                <div style={cardStyle}>
                  <p><strong>Date:</strong> {entry.created_at}</p>
                  <p><strong>Labels:</strong> {entry.labels}</p>
                  <p>
                    <strong>Classification:</strong>{' '}
                    <span className={entry.result === 'Vegan' ? 'text-success' : 'text-danger'}>
                      {entry.result}
                    </span>
                  </p>
                  {entry.feedback && (
                    <p><strong>Feedback:</strong> {entry.feedback}</p>
                  )}

                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <p className="mb-1 text-muted">Uploaded Image:</p>
                      <img
                        src={`http://localhost:5000/image/${entry.image_path}`}
                        alt="Uploaded"
                        style={imageStyle}
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-muted">Result Image:</p>
                      <img
                        src={`http://localhost:5000/image/${entry.result_image_path}`}
                        alt="Result"
                        style={imageStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewHistory;
