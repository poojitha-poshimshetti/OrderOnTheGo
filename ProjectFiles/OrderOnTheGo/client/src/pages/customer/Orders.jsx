import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { orderAPI } from '../../services/api'
import { FiPackage, FiClock, FiMapPin, FiPhone, FiChevronRight, FiStar, FiRefreshCw, FiCheck, FiTruck, FiHome } from 'react-icons/fi'
import BackButton from '../../components/common/BackButton'
import toast from 'react-hot-toast'

export default function Orders() {
    const [activeTab, setActiveTab] = useState('active')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderAPI.getAll()
                setOrders(data)
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
        const interval = setInterval(fetchOrders, 15000) // Poll every 15s for live status
        return () => clearInterval(interval)
    }, [])

    const activeOrders = orders.filter(o => ['pending', 'placed', 'confirmed', 'accepted', 'preparing', 'out_for_delivery'].includes(o.status))
    const pastOrders = orders.filter(o => ['delivered', 'cancelled', 'rejected'].includes(o.status))

    const getStatusColor = (status) => {
        switch (status) {
            case 'placed': return 'from-blue-500 to-indigo-500'
            case 'confirmed':
            case 'accepted': return 'from-indigo-500 to-purple-500'
            case 'preparing': return 'from-amber-500 to-orange-500'
            case 'out_for_delivery': return 'from-cyan-500 to-blue-500'
            case 'delivered': return 'from-green-500 to-emerald-500'
            case 'cancelled':
            case 'rejected': return 'from-red-500 to-rose-600'
            default: return 'from-gray-500 to-gray-600'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'placed': return '📋'
            case 'confirmed':
            case 'accepted': return '👍'
            case 'preparing': return '👨‍🍳'
            case 'out_for_delivery': return '🚴'
            case 'delivered': return '✅'
            case 'cancelled': return '❌'
            default: return '📦'
        }
    }

    const getStatusText = (status) => {
        const labels = {
            pending: 'ORDER PLACED',
            placed: 'ORDER PLACED',
            confirmed: 'ACCEPTED BY RESTAURANT',
            accepted: 'ACCEPTED BY RESTAURANT',
            preparing: 'PREPARING YOUR FOOD 👨‍🍳',
            out_for_delivery: 'OUT FOR DELIVERY 🚴',
            delivered: 'DELIVERED ✅',
            cancelled: 'CANCELLED'
        }
        return labels[status] || status?.replace(/_/g, ' ').toUpperCase() || 'PROCESSING'
    }

    const renderOrderCard = (order, idx) => (
        <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
        >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getStatusColor(order.status)} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3 text-white">
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: order.status !== 'delivered' && order.status !== 'cancelled' ? Infinity : 0 }} className="text-2xl">
                        {getStatusIcon(order.status)}
                    </motion.span>
                    <div>
                        <p className="font-bold text-lg">{getStatusText(order.status)}</p>
                        {order.eta && <p className="text-sm text-white/80">ETA: {order.eta}</p>}
                    </div>
                </div>
                <span className="text-white/80 text-sm font-medium">#{order._id?.slice(-6).toUpperCase()}</span>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex gap-4 mb-4">
                    <img src={order.restaurant?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} alt={order.restaurant?.name || 'Restaurant'} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{order.restaurant?.name || 'Unknown Restaurant'}</h3>
                        <p className="text-sm text-gray-500 mb-2">{new Date(order.createdAt).toLocaleString()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {order.items?.map(i => `${i.name || 'Item'} x${i.quantity}`).join(', ')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-rose-500">₹{order.total}</p>
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-dark-border rounded-xl mb-4">
                    <FiMapPin className="text-rose-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{order.address?.street || order.deliveryAddress?.street || 'Delivery Address'}</span>
                </div>

                {/* OTP Display */}
                {['confirmed', 'accepted', 'preparing', 'out_for_delivery'].includes(order.status) && order.deliveryOtp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 p-4 rounded-xl mb-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800/40 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <span className="text-xl">🔐</span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 uppercase tracking-wider">Delivery OTP</p>
                                <p className="text-xs text-orange-600 dark:text-orange-400">Share with delivery partner</p>
                            </div>
                        </div>
                        <div className="text-2xl font-mono font-bold text-orange-600 dark:text-orange-400 tracking-[0.2em] bg-white dark:bg-black/20 px-4 py-2 rounded-lg border border-orange-100 dark:border-orange-800/30">
                            {order.deliveryOtp}
                        </div>
                    </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    {!['delivered', 'cancelled', 'rejected'].includes(order.status) ? (
                        <>
                            <motion.button whileHover={{ scale: 1.02 }} className="flex-1 py-3 bg-gray-100 dark:bg-dark-border rounded-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                                <FiPhone size={18} /> Contact
                            </motion.button>
                            <Link to={`/order/${order._id}/track`} className="flex-1">
                                <motion.button whileHover={{ scale: 1.02 }} className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl font-semibold text-white flex items-center justify-center gap-2">
                                    Track Order <FiChevronRight />
                                </motion.button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {order.status === 'delivered' && (
                                <Link to={`/restaurant/${order.restaurant?._id || order.restaurant}`} className="flex-1">
                                    <motion.button whileHover={{ scale: 1.02 }} className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl font-semibold text-white flex items-center justify-center gap-2">
                                        Order Again <FiChevronRight />
                                    </motion.button>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-600 via-purple-600 to-cyan-600 py-12 relative overflow-hidden">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="mb-4">
                        <BackButton />
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <FiPackage className="text-white" size={40} />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-black text-white">My Orders</h1>
                            <p className="text-white/80">{activeOrders.length} active • {pastOrders.length} past orders</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-16 z-40 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border-b border-gray-200 dark:border-dark-border">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex gap-2 bg-gray-100 dark:bg-dark-card p-1 rounded-xl">
                        {[
                            { id: 'active', label: 'Active', icon: '🔄', count: activeOrders.length },
                            { id: 'past', label: 'Past', icon: '✅', count: pastOrders.length }
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-dark-border'}`}>
                                    {tab.count}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'active' ? (
                        activeOrders.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-4">📦</motion.div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No active orders</h3>
                                <p className="text-gray-500 mb-6">Ready to order something delicious?</p>
                                <Link to="/search">
                                    <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl">
                                        Explore Restaurants
                                    </motion.button>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div key="active" className="space-y-6">
                                {activeOrders.map((order, idx) => renderOrderCard(order, idx))}
                            </motion.div>
                        )
                    ) : (
                        <motion.div key="past" className="space-y-6">
                            {pastOrders.map((order, idx) => renderOrderCard(order, idx))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
