import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FiPackage, FiClock, FiTruck, FiCheck, FiSearch, FiFilter,
    FiChevronDown, FiMapPin, FiPhone
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import BackButton from '../../components/common/BackButton'

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedOrder, setExpandedOrder] = useState(null)

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        // Add some mock orders
        const mockOrders = [
            {
                id: 1001,
                customer: { name: 'John Doe', phone: '+91 98765 43210' },
                items: [{ name: 'Chicken Biryani', quantity: 2, price: 299 }, { name: 'Raita', quantity: 1, price: 49 }],
                restaurant: { name: 'Biryani House', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },
                total: 647,
                address: { street: '123 Main Street', city: 'Bangalore', pincode: '560001' },
                status: 'preparing',
                createdAt: new Date(Date.now() - 15 * 60000).toISOString()
            },
            {
                id: 1002,
                customer: { name: 'Jane Smith', phone: '+91 87654 32109' },
                items: [{ name: 'Margherita Pizza', quantity: 1, price: 299 }],
                restaurant: { name: 'Pizza Paradise', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
                total: 339,
                address: { street: '456 Oak Avenue', city: 'Bangalore', pincode: '560002' },
                status: 'out_for_delivery',
                createdAt: new Date(Date.now() - 30 * 60000).toISOString()
            },
            {
                id: 1003,
                customer: { name: 'Mike Johnson', phone: '+91 76543 21098' },
                items: [{ name: 'Butter Chicken', quantity: 1, price: 349 }, { name: 'Naan', quantity: 4, price: 120 }],
                restaurant: { name: 'Punjab Grill', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
                total: 509,
                address: { street: '789 Park Road', city: 'Bangalore', pincode: '560003' },
                status: 'placed',
                createdAt: new Date(Date.now() - 5 * 60000).toISOString()
            },
            ...storedOrders.map(o => ({
                ...o,
                customer: { name: 'Guest User', phone: '+91 00000 00000' }
            }))
        ]
        setOrders(mockOrders)
    }, [])

    const statusSteps = ['placed', 'preparing', 'out_for_delivery', 'delivered']

    const getStatusIcon = (status) => {
        switch (status) {
            case 'placed': return FiPackage
            case 'preparing': return FiClock
            case 'out_for_delivery': return FiTruck
            case 'delivered': return FiCheck
            default: return FiPackage
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'placed': return 'bg-blue-500'
            case 'preparing': return 'bg-yellow-500'
            case 'out_for_delivery': return 'bg-orange-500'
            case 'delivered': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ))
        toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`)
    }

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'all' || o.status === filter
        const matchesSearch = o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toString().includes(searchQuery)
        return matchesFilter && matchesSearch
    })

    const formatTime = (dateString) => {
        const diff = Date.now() - new Date(dateString).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 60) return `${mins} min ago`
        if (mins < 1440) return `${Math.floor(mins / 60)} hrs ago`
        return `${Math.floor(mins / 1440)} days ago`
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
                            Orders Management
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        Track and manage all customer orders
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border focus:border-primary-500 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['all', 'placed', 'preparing', 'out_for_delivery', 'delivered'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === status
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border'
                                    }`}
                            >
                                {status === 'all' ? 'All Orders' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-2xl">
                            <p className="text-6xl mb-4">📦</p>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">No orders found</h4>
                        </div>
                    ) : (
                        filteredOrders.map((order, idx) => {
                            const StatusIcon = getStatusIcon(order.status)
                            const isExpanded = expandedOrder === order.id
                            const currentStep = statusSteps.indexOf(order.status)

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={order.restaurant?.image}
                                                    alt={order.restaurant?.name}
                                                    className="w-14 h-14 rounded-xl object-cover"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 dark:text-white">#{order.id}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                                                            {order.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {order.restaurant?.name} • {order.items?.length} items
                                                    </p>
                                                    <p className="text-xs text-gray-400">{formatTime(order.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-lg text-gray-900 dark:text-white">₹{order.total}</span>
                                                <FiChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="border-t border-gray-100 dark:border-dark-border"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Customer Info */}
                                                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                                        <span className="font-bold text-primary-600 dark:text-primary-400">
                                                            {order.customer?.name?.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 dark:text-white">{order.customer?.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <FiPhone size={12} />
                                                            {order.customer?.phone}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Items</h4>
                                                    <div className="space-y-2">
                                                        {order.items?.map((item, i) => (
                                                            <div key={i} className="flex justify-between text-sm">
                                                                <span className="text-gray-700 dark:text-gray-300">
                                                                    {item.quantity}x {item.name}
                                                                </span>
                                                                <span className="text-gray-900 dark:text-white font-medium">
                                                                    ₹{item.price * item.quantity}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Address */}
                                                <div className="flex items-start gap-2 text-sm">
                                                    <FiMapPin className="mt-0.5 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {order.address?.street}, {order.address?.city} - {order.address?.pincode}
                                                    </span>
                                                </div>

                                                {/* Status Update */}
                                                {order.status !== 'delivered' && (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Update Status</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {statusSteps.slice(currentStep + 1).map(status => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => updateOrderStatus(order.id, status)}
                                                                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${getStatusColor(status)} hover:opacity-90 transition-opacity`}
                                                                >
                                                                    Mark as {status.replace('_', ' ')}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
