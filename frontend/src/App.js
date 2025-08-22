import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/globalStyles';
import theme from './styles/theme';

import Header from './components/header';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import AdminDashboard from './pages/adminDashboard';
import StoreOwnerDashboard from './pages/storeOwnerDashboard';
import StoreList from './pages/storeList';
import Profile from './pages/profile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <div className="App">
          {user && <Header user={user} onLogout={handleLogout} />}
          <div className="container">
            <Routes>
              <Route path="/" element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              } />
              <Route path="/login" element={
                user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
              } />
              <Route path="/register" element={
                user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />
              } />
              <Route path="/dashboard" element={
                !user ? <Navigate to="/login" /> : <Dashboard user={user} />
              } />
              <Route path="/admin" element={
                !user ? <Navigate to="/login" /> : user.role === 'admin' ? 
                  <AdminDashboard user={user} /> : <Navigate to="/dashboard" />
              } />
              <Route path="/store-owner" element={
                !user ? <Navigate to="/login" /> : user.role === 'store_owner' || user.role === 'admin' ? 
                  <StoreOwnerDashboard user={user} /> : <Navigate to="/dashboard" />
              } />
              <Route path="/stores" element={
                !user ? <Navigate to="/login" /> : <StoreList user={user} />
              } />
              <Route path="/profile" element={
                !user ? <Navigate to="/login" /> : <Profile user={user} />
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;