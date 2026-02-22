import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiArrowRight, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import BackButton from '../../components/common/BackButton'
import { userAPI, restaurantAPI, productAPI } from '../../services/api' // Assuming productAPI exists/needed or we fetch from user profile populated
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Favorites() {
    const { user } = useAuth() // This user from context might not have populated favorites
    const [favorites, setFavorites] = useState([]) // Restaurants
    const [favoriteDishes, setFavoriteDishes] = useState([]) // Dishes
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('restaurants')

    useEffect(() => {
        fetchFavorites()
    }, [])

    const fetchFavorites = async () => {
        try {
            // We need to fetch the profile to get populated data because user context might be stale or unpopulated
            const profile = await userAPI.getProfile()
            setFavorites(profile.favorites || [])
            setFavoriteDishes(profile.favoriteDishes || [])
        } catch (error) {
            console.error(error)
            toast.error('Failed to load favorites')
        } finally {
            setLoading(false)
        }
    }

    const removeRestaurant = async (id) => {
        try {
            await userAPI.toggleFavorite(id)
            setFavorites(prev => prev.filter(item => item._id !== id))
            toast.success('Removed from favorites')
        } catch (error) {
            toast.error('Failed to remove')
        }
    }

    const removeDish = async (id) => {
        try {
            await userAPI.toggleFavoriteDish(id)
            setFavoriteDishes(prev => prev.filter(item => item._id !== id))
            toast.success('Removed from favorites')
        } catch (error) {
            toast.error('Failed to remove')
        }
    }

    if (loading) return (
        <div className="min-h-screen pt-24 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <BackButton />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('restaurants')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'restaurants'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                            : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                            }`}
                    >
                        Restaurants
                    </button>
                    <button
                        onClick={() => setActiveTab('dishes')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'dishes'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                            : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                            }`}
                    >
                        Dishes
                    </button>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'restaurants' && favorites.length > 0 ? (
                        favorites.map(restaurant => (
                            <motion.div
                                key={restaurant._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow group relative"
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => removeRestaurant(restaurant._id)}
                                        className="p-2 bg-white/90 dark:bg-black/50 rounded-full text-rose-500 hover:scale-110 transition-transform"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                                <Link to={`/restaurant/${restaurant._id}`} className="block">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-48 object-cover rounded-xl mb-4"
                                    />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{restaurant.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {restaurant.cuisine.join(', ')} • {restaurant.deliveryTime}
                                    </p>
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                        ⭐ {restaurant.rating}
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : activeTab === 'dishes' && favoriteDishes.length > 0 ? (
                        favoriteDishes.map(dish => (
                            <motion.div
                                key={dish._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-border flex gap-4 relative group"
                            >
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-24 h-24 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{dish.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{dish.description}</p>
                                    <p className="text-rose-500 font-bold">₹{dish.price}</p>
                                </div>
                                <button
                                    onClick={() => removeDish(dish._id)}
                                    className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                            <FiHeart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">No favorites yet</p>
                            <Link to="/" className="inline-block mt-4 px-6 py-2 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600">
                                Explore
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
