import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';
import Cart from './Components/cart/Cart.jsx';
import Login from './Components/users/Login';
import Register from './Components/users/Register';
import Profile from './Components/users/Profile';
import UpdateProfile from './Components/users/UpdateProfile';
import OrderSuccess from './Components/cart/OrderSuccess';
import ListOrders from './Components/order/ListOrders';
import OrderDetails from './Components/order/OrderDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Home redirects to login if not authenticated (handled inside Home.jsx) */}
            <Route path="/" element={<Home />} />

            <Route path="/users/login" element={<Login />} />
            <Route path="/users/signup" element={<Register />} />
            <Route path="/users/me" element={<Profile />} />
            <Route path="/users/me/update" element={<UpdateProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/eats/orders/success" element={<OrderSuccess />} />
            <Route path="/eats/orders/me/myOrders" element={<ListOrders />} />
            <Route path="/eats/orders/:id" element={<OrderDetails />} />

            {/* Catch-all → redirect to login */}
            <Route path="*" element={<Navigate to="/users/login" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </div>
    </Router>
  );
}

export default App;
