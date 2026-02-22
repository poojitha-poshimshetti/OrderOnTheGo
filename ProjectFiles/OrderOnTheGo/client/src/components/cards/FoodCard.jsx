import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { FiStar, FiPlus, FiMinus, FiHeart } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function FoodCard({ item, restaurant, index = 0 }) {
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart()
    const [isAnimating, setIsAnimating] = useState(false)
    const cardRef = useRef(null)

    const { id, name, description, price, image, isVeg, rating, reviews, bestseller } = item

    // Find item in cart
    const cartItem = cart.items.find(i => i.id === id)
    const quantity = cartItem?.quantity || 0

    const { user, updateUser } = useAuth()
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        if (user && user.favoriteDishes) {
            const isFav = user.favoriteDishes.some(fav =>
                (typeof fav === 'string' ? fav : fav._id) === id
            )
            setIsLiked(isFav)
        }
    }, [user, id])

    const handleLike = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            toast.error('Please login to save favorites')
            return
        }

        try {
            const updatedFavorites = await userAPI.toggleFavoriteDish(id)
            setIsLiked(!isLiked)
            if (updateUser) {
                updateUser({ ...user, favoriteDishes: updatedFavorites })
            }
            toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites')
        } catch (error) {
            toast.error('Failed to update favorites')
        }
    }

    const handleAdd = () => {
        setIsAnimating(true)
        addToCart(item, restaurant)
        setTimeout(() => setIsAnimating(false), 800)
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white dark:bg-dark-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-4"
        >
            <div className="flex gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Veg/Non-veg Badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`w-5 h-5 border-2 rounded flex items-center justify-center ${isVeg
                            ? 'border-green-500'
                            : 'border-red-500'
                            }`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                        </span>
                        {bestseller && (
                            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                                ⭐ Bestseller
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {name}
                    </h3>

                    {/* Price */}
                    <p className="font-bold text-gray-900 dark:text-white mb-2">
                        ₹{price}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        <FiStar size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {rating} ({reviews})
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Image & Add Button */}
                <div className="relative flex-shrink-0">
                    <div className="w-28 h-28 rounded-xl overflow-hidden food-image-zoom relative group">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={handleLike}
                            className={`absolute top-1 right-1 p-1.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isLiked
                                ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                                : 'bg-white/50 border-white/30 text-white hover:bg-white/70'
                                }`}
                        >
                            <FiHeart className={isLiked ? 'fill-current' : ''} size={14} />
                        </button>
                    </div>

                    {/* Add Button / Quantity Controls */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                        <AnimatePresence mode="wait">
                            {quantity === 0 ? (
                                <motion.button
                                    key="add"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAdd}
                                    className="px-6 py-2 bg-white dark:bg-dark-surface border-2 border-primary-500 text-primary-500 font-semibold rounded-lg shadow-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                >
                                    ADD
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="quantity"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-3 px-2 py-1 bg-primary-500 rounded-lg shadow-lg"
                                >
                                    <button
                                        onClick={() => updateQuantity(id, quantity - 1)}
                                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded transition-colors"
                                    >
                                        <FiMinus size={16} />
                                    </button>
                                    <span className="text-white font-semibold min-w-[20px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(id, quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded transition-colors"
                                    >
                                        <FiPlus size={16} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Fly to Cart Animation */}
            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        initial={{
                            position: 'absolute',
                            top: '50%',
                            right: '60px',
                            scale: 1,
                            opacity: 1
                        }}
                        animate={{
                            top: '-50px',
                            right: '-50px',
                            scale: 0.3,
                            opacity: 0
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-16 h-16 rounded-xl overflow-hidden shadow-lg pointer-events-none z-50"
                    >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
