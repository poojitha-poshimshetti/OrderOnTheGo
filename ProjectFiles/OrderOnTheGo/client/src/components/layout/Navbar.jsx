import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../assets/logo.png'
import {
    FiSun, FiMoon, FiShoppingCart, FiSearch, FiMenu, FiX,
    FiUser, FiLogOut, FiHome, FiList, FiSettings, FiHeart, FiPercent,
    FiMapPin, FiPackage, FiShoppingBag
} from 'react-icons/fi'
import BackButton from '../common/BackButton'

export default function Navbar() {
    const { isDark, isLateNight, toggleTheme } = useTheme()
    const { getItemCount } = useCart()
    const { user, isAdmin, logout } = useAuth()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsProfileOpen(false)
    }, [location])

    const cartCount = getItemCount()

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl shadow-lg py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Left Section (Back Button + Logo) */}
                    <div className="flex items-center">
                        <BackButton />
                        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="relative"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-2xl blur-lg opacity-40"
                                />
                                <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-dark-card p-1.5 shadow-lg border border-gray-100 dark:border-dark-border">
                                    <img src={Logo} alt="OrderOnTheGo" className="w-full h-full object-contain" />
                                </div>
                            </motion.div>
                            <div className="hidden sm:block">
                                <h1 className="font-bold text-lg">
                                    <span className="text-rose-500">Order</span>
                                    <span className="text-orange-500">On</span>
                                    <span className="text-green-500">TheGo</span>
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">by SB Foods</p>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar - Desktop (Hidden for Admin) */}
                    {!isAdmin ? (
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative w-full"
                            >
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for restaurants, cuisines..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-dark-surface/80 backdrop-blur-sm border-2 border-transparent focus:border-rose-500 transition-all dark:text-white placeholder-gray-500"
                                    onClick={() => navigate('/search')}
                                    readOnly
                                />
                            </motion.div>
                        </div>
                    ) : (
                        <div className="hidden md:flex flex-1 justify-center gap-6">
                            {[
                                { name: 'Dashboard', path: '/admin', icon: FiHome },
                                { name: 'Restaurants', path: '/admin/restaurants', icon: FiMapPin },
                                { name: 'Products', path: '/admin/products', icon: FiPackage },
                                { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag }
                            ].map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${location.pathname === link.path
                                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface'
                                        }`}
                                >
                                    <link.icon size={18} />
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Late Night Badge */}
                        {isLateNight && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-indigo-500/30"
                            >
                                <span className="w-2 h-2 bg-indigo-400 rounded-full live-pulse" />
                                <span className="text-xs font-medium text-indigo-400">Late Night</span>
                            </motion.div>
                        )}

                        {/* Theme Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-accent transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <FiSun className="text-amber-400" size={20} />
                            ) : (
                                <FiMoon className="text-indigo-600" size={20} />
                            )}
                        </motion.button>

                        {/* Cart */}
                        {!isAdmin && (
                            <Link to="/cart">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-accent transition-colors"
                                >
                                    <FiShoppingCart className="text-gray-600 dark:text-gray-300" size={20} />
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </motion.button>
                            </Link>
                        )}

                        {/* Profile / Login */}
                        {user ? (
                            <div className="relative">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="font-semibold text-sm">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-dark-border"
                                        >
                                            <div className="p-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm opacity-80">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
                                                    <FiUser className="text-gray-500" />
                                                    <span className="text-sm dark:text-white">Profile</span>
                                                </Link>
                                                <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
                                                    <FiList className="text-gray-500" />
                                                    <span className="text-sm dark:text-white">Orders</span>
                                                </Link>
                                                {isAdmin && (
                                                    <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
                                                        <FiSettings className="text-gray-500" />
                                                        <span className="text-sm dark:text-white">Admin Panel</span>
                                                    </Link>
                                                )}
                                                {user.role === 'restaurant' && (
                                                    <Link to="/restaurant-dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
                                                        <FiSettings className="text-gray-500" />
                                                        <span className="text-sm dark:text-white">Restaurant Dashboard</span>
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        logout()
                                                        navigate('/')
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                                                >
                                                    <FiLogOut />
                                                    <span className="text-sm">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all"
                                >
                                    Login
                                </motion.button>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-dark-surface"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="text-gray-600 dark:text-gray-300" size={20} />
                            ) : (
                                <FiMenu className="text-gray-600 dark:text-gray-300" size={20} />
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4"
                        >
                            <div className="relative mb-4">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-surface dark:text-white"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false)
                                        navigate('/search')
                                    }}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-1 bg-gray-50 dark:bg-dark-surface rounded-2xl p-2">
                                {!isAdmin ? (
                                    <>
                                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiHome className="text-rose-500" /> Home
                                        </Link>
                                        <Link to="/offers" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 text-rose-600 transition-colors">
                                            <FiPercent className="text-rose-500" /> Offers 🔥
                                        </Link>
                                        <Link to="/favorites" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiHeart className="text-rose-500" /> Favorites
                                        </Link>
                                        <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiList className="text-gray-500" /> Orders
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiUser className="text-gray-500" /> Profile
                                        </Link>
                                        {user?.role === 'restaurant' && (
                                            <Link to="/restaurant-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                                <FiSettings className="text-gray-500" /> Dashboard
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiHome className="text-rose-500" /> Dashboard
                                        </Link>
                                        <Link to="/admin/restaurants" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiMapPin className="text-gray-500" /> Restaurants
                                        </Link>
                                        <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiPackage className="text-gray-500" /> Products
                                        </Link>
                                        <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-card dark:text-white transition-colors">
                                            <FiShoppingBag className="text-gray-500" /> Orders
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}
