import React, { FC, useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateAddress, validatePassword } from "../validation/Validations";

interface RegisterPageState {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrorState {
  userNameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
}

const RegisterPage: FC = () => {
  const [state, setState] = useState<RegisterPageState>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrorState>({
    userNameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const errors = { ...formErrors };

    switch (name) {
      case "userName":
        errors.userNameError = value.trim() === "" ? "Please enter your full name" : "";
        break;
      case "email":
        errors.emailError = validateAddress(value) ? "" : "Please enter a valid email";
        break;
      case "password":
        errors.passwordError = validatePassword(value)
          ? ""
          : "Password must be at least 8 characters atleast 1 uppercase,1 lowercase,1 digit and 1 special character";
        break;
      case "confirmPassword":
        errors.confirmPasswordError =
          value === state.password ? "" : "Passwords do not match";
        break;
    }

    setFormErrors(errors);
  };

  const isFormValid = () => {
    return (
      state.userName &&
      state.email &&
      state.password &&
      state.confirmPassword &&
      Object.values(formErrors).every((err) => err === "")
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const res = await axios.post("http://localhost:5000/register", state);
      if (res.data.success) {
        // ✅ Save user to localStorage
        localStorage.setItem('user', JSON.stringify({ userName: state.userName, email: state.email }));
        setServerMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setServerMessage(res.data.message || "Registration failed");
      }
    } catch (err) {
      setServerMessage("Server error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              name="userName"
              value={state.userName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {formErrors.userNameError && (
              <span className="text-danger">{formErrors.userNameError}</span>
            )}
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              value={state.email}
              onChange={handleChange}
              placeholder="example@mail.com"
            />
            {formErrors.emailError && (
              <span className="text-danger">{formErrors.emailError}</span>
            )}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={state.password}
              onChange={handleChange}
            />
            {formErrors.passwordError && (
              <span className="text-danger">{formErrors.passwordError}</span>
            )}
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={state.confirmPassword}
              onChange={handleChange}
            />
            {formErrors.confirmPasswordError && (
              <span className="text-danger">{formErrors.confirmPasswordError}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!isFormValid()}
          >
            Register
          </button>

          <div className="mt-3 text-center">
            Already Registered? <a href="/login">Login here</a>
          </div>
          {serverMessage && <div className="text-center mt-2 text-danger">{serverMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
