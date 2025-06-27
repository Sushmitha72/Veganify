import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  userName: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changeMsg, setChangeMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    const email = localUser.email;

    if (email) {
      axios.get(`http://localhost:5000/profile/${email}`)
        .then(res => {
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
          } else {
            setError(res.data.message || 'Unable to fetch user details.');
          }
        })
        .catch(() => setError('Unable to fetch user details.'));
    } else {
      setError('No user is logged in.');
    }
  }, []);

  const handleChangePassword = () => {
    if (user) {
      axios.post('http://localhost:5000/change-password', {
        email: user.email,
        currentPassword,
        newPassword
      })
        .then(res => setChangeMsg(res.data.message))
        .catch(() => setChangeMsg("Failed to change password."));
    }
  };

  const handleDeleteAccount = () => {
    if (user && window.confirm('Are you sure you want to delete your account?')) {
      axios.post('http://localhost:5000/delete-account', { email: user.email })
        .then(res => {
          setDeleteMsg(res.data.message);
          localStorage.removeItem('user');
          setTimeout(() => window.location.href = '/', 2000);
        })
        .catch(() => setDeleteMsg("Failed to delete account."));
    }
  };

  const handleGoBack = () => {
    window.history.back(); // navigate to previous page
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
      <br></br>

      {/* Profile Content */}
      <div className="container mt-5 p-4 shadow" style={{
        maxWidth: '650px',
        borderRadius: '15px',
        background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
        fontFamily: 'Segoe UI, sans-serif',
        marginTop: '80px' // to prevent overlap with fixed navbar
      }}>
        <h2 className="mb-4 text-center text-success">User Profile</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {user && (
          <div>
            <p><strong>Name:</strong> {user.userName}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <hr />

            {/* Change Password Dropdown */}
            <h5>
              <button
                className="btn btn-outline-primary btn-sm mb-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#changePasswordCollapse"
                aria-expanded="false"
                aria-controls="changePasswordCollapse"
              >
                Change Password
              </button>
            </h5>
            <div className="collapse" id="changePasswordCollapse">
              <div className="card card-body mb-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="form-control mb-2"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="form-control mb-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="btn btn-warning btn-sm" onClick={handleChangePassword}>
                  Update Password
                </button>
                {changeMsg && <p className="mt-2 text-muted">{changeMsg}</p>}
              </div>
            </div>

            <hr />

            {/* Delete Account */}
            <h5 className="text-danger">Delete Account</h5>
            <p className="text-muted">Permanently delete your account. This action cannot be undone.</p>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>
              Delete My Account
            </button>
            {deleteMsg && <p className="mt-2 text-danger">{deleteMsg}</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
