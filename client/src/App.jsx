import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './api';
import Nav from './components/Nav';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import './App.css';

function App() {
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), user: null });

  const loadUser = async () => {
    if (!auth.token) return;

    try {
      const response = await api.get('/auth/me');
      setAuth((prev) => ({ ...prev, user: response.data.user }));
    } catch (err) {
      localStorage.removeItem('token');
      setAuth({ token: null, user: null });
    }
  };

  useEffect(() => {
    loadUser();
  }, [auth.token]);

  const handleLogin = (user, token) => {
    localStorage.setItem('token', token);
    setAuth({ token, user: user.user });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <Router>
      <div className="app-shell">
        <Nav auth={auth} onLogout={handleLogout} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home auth={auth} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute auth={auth}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute auth={auth}>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budgets"
              element={
                <ProtectedRoute auth={auth}>
                  <Budgets />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
