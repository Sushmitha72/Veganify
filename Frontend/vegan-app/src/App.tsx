import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import CheckDish from "./pages/CheckDish";
import ViewHistory from "./pages/ViewHistory";

import AdminDashboard from "./adminpages/AdminDashboard";
import DishHistory from "./adminpages/DishHistory";
import UserManagement from "./adminpages/UserManagement";
import Recipe from "./pages/Recipe";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfilePage />} ></Route>
        <Route path="/check-dish" element={<CheckDish />} />
        <Route path="/history" element={<ViewHistory />} />
        <Route path="/recipe" element={<Recipe />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/classifications" element={<DishHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
