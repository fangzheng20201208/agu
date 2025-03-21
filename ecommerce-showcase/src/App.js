import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        
        {/* 重定向根路径到登录页面 */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 受保护的路由 */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Navbar />
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Navbar />
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <Navbar />
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <Navbar />
              <UserManagement />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; 