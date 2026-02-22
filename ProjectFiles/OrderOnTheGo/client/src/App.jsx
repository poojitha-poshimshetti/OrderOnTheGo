import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from './components/common/SplashScreen'
import Layout from './components/layout/Layout'
import Home from './pages/customer/Home'
import Restaurant from './pages/customer/IndividualRestaurant'
import Menu from './pages/customer/Menu'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import Orders from './pages/customer/Orders'
import OrderTracking from './pages/customer/OrderTracking'
import Profile from './pages/customer/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/customer/Search'
import Favorites from './pages/customer/Favorites'
import PaymentMethods from './pages/customer/PaymentMethods'
import Offers from './pages/customer/Offers'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRestaurants from './pages/admin/AdminRestaurants'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard'
import Partner from './pages/Partner'

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()

    return (
        <>
            {/* Splash Screen */}
            {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Main Layout Routes */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="restaurant/:id" element={<Restaurant />} />
                        <Route path="menu/:id" element={<Menu />} />
                        <Route path="search" element={<Search />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="order/:id/track" element={<OrderTracking />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="payment-methods" element={<PaymentMethods />} />
                        <Route path="offers" element={<Offers />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<Layout isAdmin />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="restaurants" element={<AdminRestaurants />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                    </Route>

                    {/* Restaurant Routes */}
                    <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />

                    {/* Other Routes */}
                    <Route path="/partner" element={<Partner />} />
                </Routes>
            </AnimatePresence>
        </>
    )
}

export default App
