import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { orderAPI, userAPI } from '../../services/api'
import { FiMapPin, FiClock, FiCreditCard, FiCheck, FiArrowLeft, FiPlus, FiShield, FiGift } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Checkout() {
    const { cart, clearCart, getCartTotal } = useCart()
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [selectedAddress, setSelectedAddress] = useState(0)
    const [selectedPayment, setSelectedPayment] = useState('cod')
    const [savedMethods, setSavedMethods] = useState([]) // New state
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [orderId, setOrderId] = useState('')

    // Fetch saved payment methods
    useEffect(() => {
        if (isAuthenticated) {
            userAPI.getPaymentMethods()
                .then(data => setSavedMethods(data))
                .catch(err => console.error('Failed to load payment methods', err))
        }
    }, [isAuthenticated])

    // Use user addresses or fallback to empty array
    const addresses = user?.addresses || []

    const paymentMethods = [
        { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
        { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
        { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
        { id: 'wallet', label: 'Wallet', icon: '👛', desc: 'Amazon Pay, Paytm Wallet' },
    ]

    const subtotal = getCartTotal()
    const deliveryFee = subtotal > 299 ? 0 : 40
    const tax = Math.round(subtotal * 0.05)
    // const total = subtotal + deliveryFee + tax // Calculate total later to be sure

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to place order')
            navigate('/login')
            return
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty')
            return
        }

        if (addresses.length === 0) {
            toast.error('Please add a delivery address first')
            navigate('/profile', { state: { activeTab: 'addresses' } })
            return
        }

        setIsProcessing(true)

        try {
            // Group items by restaurant to create separate orders if needed
            // For now, we assume one restaurant or just take the first one's ID
            // Ideally, we should block multi-restaurant carts or split orders
            // We'll proceed with creating one order per restaurant found in cart

            const restaurantIds = [...new Set(cart.map(item => item.restaurantId))]
            const orders = []

            for (const restId of restaurantIds) {
                const restItems = cart.filter(item => item.restaurantId === restId)
                const restSubtotal = restItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                const restDeliveryFee = restSubtotal > 299 ? 0 : 40 // Per restaurant delivery fee logic
                const restTax = Math.round(restSubtotal * 0.05)
                const restTotal = restSubtotal + restDeliveryFee + restTax

                const orderPayload = {
                    restaurant: restId,
                    items: restItems.map(item => ({
                        product: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    })),
                    subtotal: restSubtotal,
                    deliveryFee: restDeliveryFee,
                    tax: restTax,
                    total: restTotal,
                    paymentMethod: selectedPayment,
                    deliveryAddress: addresses[selectedAddress]
                }

                orders.push(orderAPI.create(orderPayload))
            }

            const results = await Promise.all(orders)

            // Just show the first order ID for simplicity or a success message
            const newOrderId = results[0]._id
            setOrderId(newOrderId)
            setOrderPlaced(true)
            clearCart()
            toast.success('Order placed successfully!', { icon: '🎉' })

        } catch (error) {
            console.error('Order error:', error)
            toast.error(error.message || 'Failed to place order')
        } finally {
            setIsProcessing(false)
        }
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}>
                            <FiCheck className="text-white" size={60} />
                        </motion.div>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                        Order Placed! 🎉
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-500 mb-2">
                        Your order has been confirmed
                    </motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-rose-500 font-bold text-lg mb-8">
                        Order ID: {orderId}
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col gap-3">
                        <Link to="/orders">
                            <motion.button whileHover={{ scale: 1.02 }} className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl">
                                Track Order
                            </motion.button>
                        </Link>
                        <Link to="/">
                            <motion.button whileHover={{ scale: 1.02 }} className="w-full py-4 bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 font-bold rounded-2xl">
                                Back to Home
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">🛒</motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
                    <Link to="/search">
                        <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl">
                            Browse Food
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-600 via-purple-600 to-cyan-600 py-8 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <Link to="/cart" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
                        <FiArrowLeft /> Back to Cart
                    </Link>
                    <h1 className="text-3xl font-black text-white">Checkout</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <FiMapPin className="text-white" size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                                    <p className="text-sm text-gray-500">Select where to deliver</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {addresses.length > 0 ? addresses.map((addr, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => setSelectedAddress(idx)}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress === idx
                                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10'
                                            : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '🏢' : '📍'}</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 dark:text-white">{addr.type}</p>
                                                <p className="text-sm text-gray-500">{addr.address}, {addr.city} - {addr.pincode}</p>
                                            </div>
                                            {selectedAddress === idx && (
                                                <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                                                    <FiCheck className="text-white" size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <p className="text-gray-500 text-center py-4">No addresses saved. Please add one.</p>
                                )}
                                <Link to="/profile" state={{ activeTab: 'addresses' }}>
                                    <motion.button whileHover={{ scale: 1.02 }} className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-2xl text-gray-500 flex items-center justify-center gap-2 hover:border-rose-500 hover:text-rose-500 transition-colors mt-2">
                                        <FiPlus /> Add/Manage Address
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <FiCreditCard className="text-white" size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                                    <p className="text-sm text-gray-500">Choose how to pay</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Saved Methods */}
                                {savedMethods.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Saved Cards & UPI</h3>
                                        <div className="space-y-2">
                                            {savedMethods.map((method) => (
                                                <motion.div
                                                    key={method._id}
                                                    whileHover={{ scale: 1.01 }}
                                                    onClick={() => setSelectedPayment(method._id)}
                                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPayment === method._id
                                                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10'
                                                        : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{method.type === 'Card' ? '💳' : '📱'}</span>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-gray-900 dark:text-white">
                                                                {method.type === 'Card'
                                                                    ? `•••• ${method.cardNumber.slice(-4)}`
                                                                    : method.upiId}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {method.type === 'Card' ? `Expires ${method.expiry}` : 'UPI ID'}
                                                            </p>
                                                        </div>
                                                        {selectedPayment === method._id && (
                                                            <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                                                                <FiCheck className="text-white" size={14} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Other Methods */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Other Options</h3>
                                    <div className="space-y-2">
                                        {paymentMethods.map((method) => (
                                            <motion.div
                                                key={method.id}
                                                whileHover={{ scale: 1.01 }}
                                                onClick={() => setSelectedPayment(method.id)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPayment === method.id
                                                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10'
                                                    : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{method.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-900 dark:text-white">{method.label}</p>
                                                        <p className="text-sm text-gray-500">{method.desc}</p>
                                                    </div>
                                                    {selectedPayment === method.id && (
                                                        <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                                                            <FiCheck className="text-white" size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {cart.map((item) => (
                                    <div key={`${item.restaurantId}-${item.id}`} className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 dark:border-dark-border pt-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className={deliveryFee === 0 ? 'text-green-500 font-semibold' : 'font-semibold'}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Taxes</span><span className="font-semibold">₹{tax}</span></div>
                                <div className="border-t border-gray-100 dark:border-dark-border pt-2 flex justify-between">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-black text-2xl text-rose-500">₹{subtotal + deliveryFee + tax}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Secure Badge */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 justify-center text-gray-500 text-sm">
                            <FiShield size={16} />
                            <span>100% Secure Payment</span>
                        </motion.div>

                        {/* Place Order Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="w-full py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-3xl shadow-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full" />
                                    Processing...
                                </>
                            ) : (
                                <>Place Order • ₹{subtotal + deliveryFee + tax}</>
                            )}
                        </motion.button>

                        <p className="text-center text-xs text-gray-400">
                            By placing order, you agree to our Terms & Conditions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
