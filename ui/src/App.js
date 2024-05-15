import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";

import './global.css';
import { AuthProvider, useAuth } from "./contexts/Auth";
import { DashboardScreen, LoginScreen } from "./screens";
import { Sidebar } from "./components";

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace />
  )
}

const sidebarPage = (Component) => {
  return () => {
    const location = useLocation();
    const isLoginRoute = location.pathname === "/login";

    return (
      <div style={{ display: "flex" }}>
        { !isLoginRoute && <Sidebar /> }
        <Component/>
      </div>
    );
  }
}

const DashboardPage = sidebarPage(DashboardScreen);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen/>} />
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage/>} />} />
          <Route path="/*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
