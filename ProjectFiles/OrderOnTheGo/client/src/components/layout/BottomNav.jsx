import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { FiHome, FiSearch, FiShoppingCart, FiList, FiHeart } from 'react-icons/fi'

export default function BottomNav() {
    const location = useLocation()
    const { getItemCount } = useCart()
    const cartCount = getItemCount()

    const navItems = [
        { path: '/', icon: FiHome, label: 'Home' },
        { path: '/search', icon: FiSearch, label: 'Search' },
        { path: '/cart', icon: FiShoppingCart, label: 'Cart', badge: cartCount },
        { path: '/orders', icon: FiList, label: 'Orders' },
        { path: '/favorites', icon: FiHeart, label: 'Favorites' }
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-dark-border/50 safe-area-pb">
            <div className="flex items-center justify-around py-1">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative flex flex-col items-center py-2 px-4"
                        >
                            <motion.div
                                whileTap={{ scale: 0.85 }}
                                className={`relative p-2.5 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'gradient-bg-vibrant text-white shadow-lg shadow-rose-500/25'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {item.badge > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </motion.span>
                                )}
                            </motion.div>
                            <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive
                                ? 'text-primary-500'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
