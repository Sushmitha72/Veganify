import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { validateAddress, validatePassword } from '../validation/Validations';

interface LoginState {
  email: string;
  password: string;
}

interface FormErrorState {
  emailError: string;
  passwordError: string;
}

const LoginPage: React.FC = () => {
  const [state, setState] = useState<LoginState>({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrorState>({ emailError: '', passwordError: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    const errors = { ...formErrors };
    if (name === 'email') errors.emailError = validateAddress(value) ? '' : 'Invalid email format';
    if (name === 'password') errors.passwordError = validatePassword(value) ? '' : 'Invalid password format';
    setFormErrors(errors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      state.email &&
      state.password &&
      Object.values(formErrors).every((err) => err === "")
    );
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', state);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // Navigate based on user role
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMessage(res.data.message);
      }
    } catch (err) {
      setErrorMessage('Server error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="text" className="form-control" name="email" value={state.email} onChange={handleChange} />
            {formErrors.emailError && <span className="text-danger">{formErrors.emailError}</span>}
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={state.password} onChange={handleChange} />
            {formErrors.passwordError && <span className="text-danger">{formErrors.passwordError}</span>}
          </div>
          {errorMessage && <div className="text-danger text-center">{errorMessage}</div>}
          <button className="btn btn-primary w-100" disabled={!isFormValid()}>Login</button>
        </form>
        <div className="text-center mt-2">
          <a href="/forgot-password">Forgot password?</a><br />
          <a href="/register">New user? Register here</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
