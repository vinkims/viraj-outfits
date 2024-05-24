import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";

import './global.css';
import { AuthProvider, useAuth } from "./contexts/Auth";
import { DashboardScreen, ItemsScreen, LoginScreen } from "./screens";
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
const ItemsPage = sidebarPage(ItemsScreen);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen/>} />
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage/>} />} />
          <Route path="/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/items" element={<PrivateRoute element={<ItemsPage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
