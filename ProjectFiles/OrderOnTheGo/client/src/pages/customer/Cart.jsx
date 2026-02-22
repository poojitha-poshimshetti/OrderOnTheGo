import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../services/api'
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiPercent, FiShoppingBag, FiMapPin, FiClock, FiGift, FiTag, FiHeart } from 'react-icons/fi'
import BackButton from '../../components/common/BackButton'
import toast from 'react-hot-toast'

// Animated Emoji
const AnimatedEmoji = ({ emoji, delay = 0 }) => (
    <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200 }}
        className="text-6xl"
    >
        {emoji}
    </motion.span>
)

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
    const { user, updateUser } = useAuth()
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        if (user && user.favoriteDishes) {
            const isFav = user.favoriteDishes.some(fav =>
                (typeof fav === 'string' ? fav : fav._id) === item.id
            )
            setIsLiked(isFav)
        }
    }, [user, item.id])

    const handleLike = async () => {
        if (!user) return toast.error('Login to save favorites')
        try {
            const updated = await userAPI.toggleFavoriteDish(item.id)
            setIsLiked(!isLiked)
            if (updateUser) updateUser({ ...user, favoriteDishes: updated })
            toast.success(isLiked ? 'Removed from favorites' : 'Saved to favorites')
        } catch (error) {
            toast.error('Failed to update favorites')
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            className="p-6 border-b border-gray-100 dark:border-dark-border last:border-0"
        >
            <div className="flex gap-4">
                <div className="relative group">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
                    <span className={`absolute -top-2 -left-2 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {item.isVeg ? '🌱' : '🍖'}
                    </span>
                    <button
                        onClick={handleLike}
                        className={`absolute top-1 right-1 p-1.5 rounded-full backdrop-blur-md border transition-all ${isLiked
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'bg-white/50 border-white/30 text-white hover:bg-white/70'
                            }`}
                    >
                        <FiHeart className={isLiked ? 'fill-current' : ''} size={14} />
                    </button>
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.restaurantName}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                removeFromCart(item.id, item.restaurantId)
                                toast.success('Removed from cart', { icon: '🗑️' })
                            }}
                            className="text-gray-400 hover:text-rose-500 transition-colors"
                        >
                            <FiTrash2 size={20} />
                        </motion.button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-rose-500">₹{item.price * item.quantity}</span>
                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-dark-border rounded-xl p-1">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity - 1)}
                                className="w-9 h-9 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center shadow-sm"
                            >
                                <FiMinus size={16} />
                            </motion.button>
                            <span className="font-bold w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity + 1)}
                                className="w-9 h-9 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center shadow-sm"
                            >
                                <FiPlus size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function Cart() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [tip, setTip] = useState(0)

    // Get user's default address or first address
    const defaultAddress = user?.addresses?.find(addr => addr.isDefault) || user?.addresses?.[0]
    const addressText = defaultAddress 
        ? `${defaultAddress.type} - ${defaultAddress.address}, ${defaultAddress.city}`
        : 'Home - HSR Layout, Bangalore'

    const subtotal = getCartTotal()
    const deliveryFee = subtotal > 299 ? 0 : 40
    const discount = appliedCoupon ? Math.min(subtotal * 0.2, 100) : 0
    const total = subtotal + deliveryFee + tip - discount

    const tipOptions = [0, 20, 30, 50]

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'WELCOME50' || couponCode.toUpperCase() === 'SAVE20') {
            setAppliedCoupon(couponCode.toUpperCase())
            toast.success('Coupon applied! 20% OFF', { icon: '🎉' })
        } else {
            toast.error('Invalid coupon code')
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-8xl mb-8"
                    >
                        🛒
                    </motion.div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Explore our restaurants and find something delicious!</p>
                    <Link to="/search">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 mx-auto"
                        >
                            Explore Food <FiArrowRight />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-rose-600 via-purple-600 to-cyan-600 py-12 relative overflow-hidden">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="mb-4">
                        <BackButton />
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <FiShoppingBag className="text-white" size={40} />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-black text-white">Your Cart</h1>
                            <p className="text-white/80">{cart.length} items • {cart.reduce((sum, item) => sum + item.quantity, 0)} total quantity</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Delivery Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                                        <FiMapPin className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Deliver to</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{addressText}</p>
                                    </div>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    className="text-rose-500 font-semibold text-sm"
                                    onClick={() => navigate('/profile', { state: { activeTab: 'addresses' } })}
                                >Change</motion.button>
                            </div>
                        </motion.div>

                        {/* Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-lg"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-dark-border">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Items</h2>
                            </div>
                            <AnimatePresence>
                                {cart.map((item, idx) => (
                                    <CartItem
                                        key={`${item.restaurantId}-${item.id}`}
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeFromCart={removeFromCart}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Add more items */}
                        <Link to="/search">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg flex items-center justify-between group cursor-pointer"
                            >
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Add more items</span>
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <FiArrowRight className="text-rose-500" size={20} />
                                </motion.div>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        {/* Coupon */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <FiTag className="text-white" size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Apply Coupon</h3>
                            </div>
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-500 border-dashed">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🎉</span>
                                        <div>
                                            <p className="font-bold text-green-600">{appliedCoupon}</p>
                                            <p className="text-sm text-green-500">20% OFF applied</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setAppliedCoupon(null)} className="text-gray-400 hover:text-red-500">Remove</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-dark-border rounded-xl border-2 border-transparent focus:border-rose-500 outline-none"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={applyCoupon}
                                        className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl"
                                    >
                                        Apply
                                    </motion.button>
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-3">Try: WELCOME50, SAVE20</p>
                        </motion.div>

                        {/* Tip */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                    <FiGift className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Tip your rider</h3>
                                    <p className="text-xs text-gray-500">100% goes to your delivery partner</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {tipOptions.map((amount) => (
                                    <motion.button
                                        key={amount}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setTip(amount)}
                                        className={`py-3 rounded-xl font-semibold transition-all ${tip === amount
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                            : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {amount === 0 ? 'None' : `₹${amount}`}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Bill Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg"
                        >
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Bill Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Item Total</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-500">
                                        <span>Coupon Discount</span>
                                        <span className="font-semibold">-₹{discount}</span>
                                    </div>
                                )}
                                {tip > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Rider Tip</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">₹{tip}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-100 dark:border-dark-border pt-3 flex justify-between">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-black text-rose-500">₹{total}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Checkout Button */}
                        <Link to="/checkout">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-3xl shadow-xl flex items-center justify-center gap-3 text-lg"
                            >
                                Proceed to Checkout
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <FiArrowRight size={24} />
                                </motion.div>
                            </motion.button>
                        </Link>

                        {/* Delivery Time */}
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                            <FiClock size={16} />
                            <span className="text-sm">Estimated delivery: 25-30 min</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
