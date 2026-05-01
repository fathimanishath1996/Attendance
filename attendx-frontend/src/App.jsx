import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AttendancePage from './pages/AttendancePage';
import ProfilePage from './pages/ProfilePage';
import LeavePage from './pages/LeavePage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null); // Auth state placeholder

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />} 
        />
        <Route 
          path="/" 
          element={
            user ? (
              <Layout user={user} setUser={setUser}>
                <HomePage user={user} />
              </Layout>
            ) : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/attendance" 
          element={
            user ? (
              <Layout user={user} setUser={setUser}>
                <AttendancePage user={user} />
              </Layout>
            ) : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/leaves" 
          element={
            user ? (
              <Layout user={user} setUser={setUser}>
                <LeavePage user={user} />
              </Layout>
            ) : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/profile" 
          element={
            user ? (
              <Layout user={user} setUser={setUser}>
                <ProfilePage user={user} />
              </Layout>
            ) : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/admin" 
          element={
            user && user.role === 'admin' ? (
              <Layout user={user} setUser={setUser}>
                <AdminPage />
              </Layout>
            ) : <Navigate to="/" />
          } 
        />
        {/* Add more routes as per SRS */}
      </Routes>
    </Router>
  );
}

export default App;
