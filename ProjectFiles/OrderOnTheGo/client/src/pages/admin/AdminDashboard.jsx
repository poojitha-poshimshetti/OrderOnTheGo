import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp,
    FiPackage, FiClock, FiTruck, FiCheck, FiArrowUp, FiArrowDown,
    FiMapPin
} from 'react-icons/fi'
import { orderAPI } from '../../services/api'
import BackButton from '../../components/common/BackButton'

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        avgOrderValue: 0,
        recentOrders: [],
        popularItems: [],
        orderStatus: {
            placed: 0,
            preparing: 0,
            out_for_delivery: 0,
            delivered: 0
        }
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await orderAPI.getStats()
                setStats(data)
            } catch (error) {
                console.error("Failed to fetch admin stats", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const kpiCards = [
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: FiShoppingBag,
            change: '+12%', // This would ideally be calculated from previous period
            positive: true,
            color: 'from-blue-500 to-blue-600'
        },
        {
            label: 'Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: FiDollarSign,
            change: '+8%',
            positive: true,
            color: 'from-green-500 to-green-600'
        },
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: FiUsers,
            change: '+5%',
            positive: true,
            color: 'from-purple-500 to-purple-600'
        },
        {
            label: 'Avg Order',
            value: `₹${stats.avgOrderValue}`,
            icon: FiTrendingUp,
            change: '-2%',
            positive: false,
            color: 'from-orange-500 to-orange-600'
        }
    ]

    const getStatusBadge = (status) => {
        const styles = {
            placed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            preparing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            out_for_delivery: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }
        return styles[status] || styles.placed
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="text-4xl">
                    ⚡
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <BackButton />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        Welcome back! Here's what's happening with your store today.
                    </p>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {kpiCards.map((kpi, idx) => (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${kpi.color}`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <kpi.icon size={24} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${kpi.positive ? 'text-green-200' : 'text-red-200'}`}>
                                        {kpi.positive ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                        {kpi.change}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold mb-1">{kpi.value}</h3>
                                <p className="text-white/80">{kpi.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link to="/admin/restaurants" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card shadow-card p-6 hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/20 transition-colors" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <FiMapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Restaurants</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add & Manage Partners</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/products" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card shadow-card p-6 hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-colors" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <FiPackage size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Products</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Global Menu Items</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/orders" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card shadow-card p-6 hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <FiShoppingBag size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Orders</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Track All Deliveries</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-dark-border">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Orders
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-dark-surface">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                    {stats.recentOrders.length > 0 ? (
                                        stats.recentOrders.map((order, idx) => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-medium text-gray-900 dark:text-white">{order.customer}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                                                    {order.items} items
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    ₹{order.total}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status === 'confirmed' ? 'placed' : order.status)}`}>
                                                        {(order.status === 'confirmed' ? 'placed' : order.status).replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-sm">
                                                    {order.time}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No orders yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Popular Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Popular Items
                        </h2>
                        <div className="space-y-4">
                            {stats.popularItems.length > 0 ? (
                                stats.popularItems.map((item, idx) => (
                                    <div key={item.name} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                            <span className="text-primary-600 dark:text-primary-400 font-bold">
                                                {idx + 1}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.orders} orders</p>
                                        </div>
                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                            ₹{item.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No sales data yet</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Order Status Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                    {[
                        { label: 'Placed', count: stats.orderStatus.placed, icon: FiPackage, color: 'bg-blue-500' },
                        { label: 'Preparing', count: stats.orderStatus.preparing, icon: FiClock, color: 'bg-yellow-500' },
                        { label: 'On the way', count: stats.orderStatus.out_for_delivery, icon: FiTruck, color: 'bg-orange-500' },
                        { label: 'Delivered', count: stats.orderStatus.delivered, icon: FiCheck, color: 'bg-green-500' }
                    ].map((status, idx) => (
                        <div
                            key={status.label}
                            className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-card"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 ${status.color} rounded-xl flex items-center justify-center text-white`}>
                                    <status.icon size={20} />
                                </div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{status.label}</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{status.count}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
