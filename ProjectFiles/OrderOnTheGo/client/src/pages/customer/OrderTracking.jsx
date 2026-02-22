import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiClock, FiMapPin, FiPhone, FiUser, FiPackage, FiChevronLeft } from 'react-icons/fi'
import { orderAPI } from '../../services/api'

export default function OrderTracking() {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderAPI.getOne(id)
                setOrder(data)
            } catch (error) {
                console.error('Failed to fetch order:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
        const interval = setInterval(fetchOrder, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
    )

    if (!order) return <div className="text-center py-20">Order not found</div>

    const steps = [
        { status: 'placed', label: 'Order Placed', icon: '📝' },
        { status: 'confirmed', label: 'Confirmed', icon: '👍' },
        { status: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
        { status: 'out_for_delivery', label: 'Out for Delivery', icon: '🚴' },
        { status: 'delivered', label: 'Delivered', icon: '✅' }
    ]

    const getCurrentStepIndex = () => {
        const statusMap = {
            'pending': 0, 'placed': 0,
            'confirmed': 1, 'accepted': 1,
            'preparing': 2,
            'out_for_delivery': 3,
            'delivered': 4,
            'cancelled': -1, 'rejected': -1
        }
        return statusMap[order.status] ?? 0
    }

    const currentStep = getCurrentStepIndex()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg max-w-lg mx-auto border-x border-gray-100 dark:border-dark-border shadow-2xl relative">

            {/* Map Placeholder */}
            <div className="h-[40vh] bg-gray-200 w-full relative overflow-hidden">
                <img
                    src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/78.4867,17.3850,13,0/600x600?access_token=pk.mock_token"
                    alt="Map"
                    className="w-full h-full object-cover opacity-50"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80'}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

                <Link to="/orders" className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-800 z-10">
                    <FiChevronLeft size={24} />
                </Link>

                {/* Animated Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-rose-500 rounded-full"
                        />
                        <div className="bg-rose-600 text-white p-2 rounded-full shadow-lg relative z-10">
                            <FiPackage size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sheet */}
            <div className="bg-white dark:bg-dark-card min-h-[60vh] -mt-6 rounded-t-3xl relative p-6">
                <div className="w-12 h-1 bg-gray-200 dark:bg-dark-border rounded-full mx-auto mb-6" />

                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{order.restaurant?.name || 'Restaurant'}</h1>
                        <p className="text-gray-500 text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                    {['confirmed', 'accepted', 'preparing', 'out_for_delivery'].includes(order.status) && (
                        <div className="text-center">
                            <p className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">OTP</p>
                            <div className="bg-orange-100 text-orange-600 font-mono text-xl font-bold px-3 py-1 rounded-lg border border-orange-200">
                                {order.deliveryOtp}
                            </div>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div className="mb-8 relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-dark-border" />
                    <div className="space-y-6">
                        {steps.map((step, idx) => {
                            const isCompleted = idx <= currentStep
                            const isCurrent = idx === currentStep
                            return (
                                <div key={step.status} className="flex gap-4 relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 
                                        ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400 dark:bg-dark-border'}
                                        ${isCurrent ? 'ring-4 ring-green-100 dark:ring-green-900/30' : ''}
                                    `}>
                                        {isCompleted ? <FiCheck /> : idx + 1}
                                    </div>
                                    <div className="pt-1">
                                        <h3 className={`font-bold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{step.label}</h3>
                                        {isCurrent && <p className="text-sm text-green-600 animate-pulse">In Progress...</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Driver Info (Mock) */}
                {order.status === 'out_for_delivery' && (
                    <div className="bg-gray-50 dark:bg-dark-surface p-4 rounded-xl flex items-center gap-4 mb-6">
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100" alt="Driver" className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">James Wilson</h4>
                            <p className="text-xs text-gray-500">Delivery Partner • 4.9⭐</p>
                        </div>
                        <button className="w-10 h-10 bg-white dark:bg-dark-card rounded-full flex items-center justify-center text-green-500 shadow-sm border border-gray-100 dark:border-dark-border">
                            <FiPhone />
                        </button>
                    </div>
                )}

                {/* Order Items Summary */}
                <div className="border-t border-gray-100 dark:border-dark-border pt-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">{item.quantity}x {item.name}</span>
                            <span className="font-medium text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-dark-border">
                        <span>Total</span>
                        <span className="text-rose-500">₹{order.total}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
