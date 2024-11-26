import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";

import './global.css';
import { AuthProvider, useAuth } from "./contexts/Auth";
import { AlertProvider } from "./contexts/AlertContext";
import { CustomersScreen, DashboardScreen, ExpensesScreen, ItemsScreen, LoginScreen, TransactionsScreen, UsersScreen } from "./screens";
import { AppBarDrawer } from "./components";

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
        { !isLoginRoute && <AppBarDrawer /> }
        <Component/>
      </div>
    );
  }
}

const CustomersPage = sidebarPage(CustomersScreen);
const DashboardPage = sidebarPage(DashboardScreen);
const ExpensesPage = sidebarPage(ExpensesScreen);
const ItemsPage = sidebarPage(ItemsScreen);
const TransactionsPage = sidebarPage(TransactionsScreen);
const UsersPage = sidebarPage(UsersScreen);

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
            <Route path="/users" element={<PrivateRoute element={<UsersPage/>} />} />
            <Route path="/expenses" element={<PrivateRoute element={<ExpensesPage/>} />} />
          </Routes>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
