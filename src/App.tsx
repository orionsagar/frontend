import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import Products from './pages/dashboard/Products';
import Projects from './pages/dashboard/Projects';
import Items from './pages/dashboard/Items';
import ProductSummary from './pages/dashboard/summary/ProductSummary';
import ProjectSummary from './pages/dashboard/summary/ProjectSummary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<Products />} />
          <Route path="projects" element={<Projects />} />
          <Route path="items" element={<Items />} />
          <Route path="summary/product/:id" element={<ProductSummary />} />
          <Route path="summary/project/:id" element={<ProjectSummary />} />
          <Route path="*" element={<Navigate to="products" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
