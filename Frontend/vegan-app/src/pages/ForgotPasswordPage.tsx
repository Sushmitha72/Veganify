import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { validateAddress, validatePassword, validateConfirmPassword } from '../validation/Validations';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: validateAddress(email) ? '' : 'Invalid email',
      password: validatePassword(password) ? '' : 'Weak password',
      confirmPassword: validateConfirmPassword(confirmPassword, password) ? '' : 'Passwords do not match',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    try {
      const res = await axios.post('http://localhost:5000/reset-password', { email, password });
      setMessage(res.data.message);
    } catch {
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-3">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
          </div>
          <button className="btn btn-primary w-100">Reset</button>
          {message && <div className="text-center mt-2">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
