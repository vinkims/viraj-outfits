import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";

import './global.css';
import { AuthProvider, useAuth } from "./contexts/Auth";
import { AlertProvider } from "./contexts/AlertContext";
import { CustomersScreen, DashboardScreen, ItemsScreen, LoginScreen, TransactionsScreen } from "./screens";
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

const CustomersPage = sidebarPage(CustomersScreen);
const DashboardPage = sidebarPage(DashboardScreen);
const ItemsPage = sidebarPage(ItemsScreen);
const TransactionsPage = sidebarPage(TransactionsScreen);

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginScreen/>} />
            <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage/>} />} />
            <Route path="/*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/items" element={<PrivateRoute element={<ItemsPage />} />} />
            <Route path="/customers" element={<PrivateRoute element={<CustomersPage />} />} />
            <Route path="/transactions" element={<PrivateRoute element={<TransactionsPage/> } />} />
          </Routes>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
