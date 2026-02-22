import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiStar, FiClock, FiTrendingUp, FiHeart } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function RestaurantCard({ restaurant, index = 0 }) {
    // Destructure with fallbacks and handle both naming conventions (ratingCount from backend vs reviews)
    const {
        id,
        name,
        image,
        cuisine,
        rating,
        ratingCount,
        reviews,
        deliveryTime,
        priceRange,
        isOpen,
        lateNight,
        promoted
    } = restaurant || {}

    // Use ratingCount if available, otherwise reviews, otherwise 0
    const reviewCount = ratingCount || reviews || 0

    const { user, updateUser } = useAuth()
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        if (user && user.favorites) {
            // Check if restaurant is in favorites (handle both populated objects and ID strings)
            const isFav = user.favorites.some(fav =>
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
            const updatedFavorites = await userAPI.toggleFavorite(id)
            setIsLiked(!isLiked)

            // Update local user context to reflect change immediately if context allows, 
            // or just rely on the local state for the UI button. 
            // Ideally updateUser({ ...user, favorites: updatedFavorites }) if supported.
            if (updateUser) {
                updateUser({ ...user, favorites: updatedFavorites })
            }
            toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites')
        } catch (error) {
            toast.error('Failed to update favorites')
        }
    }

    if (!restaurant) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="group"
        >
            <Link to={`/restaurant/${id}`}>
                <div className="relative bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-dark-border">
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                    <div className="relative">
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                            <motion.img
                                src={image}
                                alt={name}
                                className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                {promoted && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg"
                                    >
                                        <FiTrendingUp size={12} />
                                        Promoted
                                    </motion.span>
                                )}
                                {lateNight && (
                                    <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        🌙 Late Night
                                    </span>
                                )}
                            </div>

                            {/* Like Button */}
                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={handleLike}
                                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isLiked
                                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/50'
                                    : 'bg-white/20 border-white/30 text-white hover:bg-white/40'
                                    }`}
                            >
                                <FiHeart className={isLiked ? 'fill-current' : ''} size={18} />
                            </motion.button>

                            {/* Bottom Info - On Image */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md rounded-full shadow-lg">
                                    <FiClock size={14} className="text-rose-500" />
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{deliveryTime}</span>
                                </div>
                                <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${isOpen
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                    : 'bg-gray-500 text-white'
                                    }`}>
                                    {isOpen ? '● Open' : 'Closed'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-rose-500 transition-colors">
                                        {name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                        {cuisine && cuisine.join ? cuisine.join(' • ') : cuisine}
                                    </p>
                                </div>

                                {/* Rating */}
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg shadow-green-500/25 ml-3"
                                >
                                    <FiStar size={14} className="text-white fill-white" />
                                    <span className="text-white text-sm font-bold">{rating || 'New'}</span>
                                </motion.div>
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {reviewCount.toLocaleString()} reviews
                                </span>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-surface px-3 py-1 rounded-full">
                                    {priceRange}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
