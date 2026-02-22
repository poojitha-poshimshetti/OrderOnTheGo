import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiPlus, FiEdit, FiTrash2, FiSearch, FiStar, FiClock,
    FiMapPin, FiX, FiCheck
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { restaurantAPI } from '../../services/api'
import BackButton from '../../components/common/BackButton'

export default function AdminRestaurants() {
    const [restaurantList, setRestaurantList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingRestaurant, setEditingRestaurant] = useState(null)
    const [formData, setFormData] = useState({
        // Owner Details (New Restaurant Only)
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        // Restaurant Details
        name: '',
        cuisine: '',
        address: '',
        rating: '4.5',
        deliveryTime: '30-45 min',
        priceRange: '₹₹',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        description: 'Authentic flavors delivered to your doorstep.'
    })

    useEffect(() => {
        fetchRestaurants()
    }, [])

    const fetchRestaurants = async () => {
        try {
            const data = await restaurantAPI.getAll()
            setRestaurantList(data)
        } catch (error) {
            toast.error('Failed to fetch restaurants')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredRestaurants = restaurantList.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.cuisine || []).some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleOpenModal = (restaurant = null) => {
        if (restaurant) {
            setEditingRestaurant(restaurant)
            setFormData({
                name: restaurant.name,
                cuisine: restaurant.cuisine.join(', '),
                address: restaurant.address?.street || restaurant.address || '',
                rating: restaurant.rating,
                deliveryTime: restaurant.deliveryTime,
                priceRange: restaurant.priceRange,
                isOpen: restaurant.isOpen,
                image: restaurant.image,
                description: restaurant.description || ''
            })
        } else {
            setEditingRestaurant(null)
            setFormData({
                ownerName: '',
                email: '',
                password: '',
                phone: '',
                name: '',
                cuisine: '',
                address: '',
                rating: '4.5',
                deliveryTime: '30-45 min',
                priceRange: '₹₹',
                isOpen: true,
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
                description: 'Authentic flavors delivered to your doorstep.'
            })
        }
        setShowModal(true)
    }

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                cuisine: formData.cuisine.split(',').map(c => c.trim()),
                restaurantName: formData.name // Backend expects restaurantName for creation
            }

            if (editingRestaurant) {
                await restaurantAPI.update(editingRestaurant._id, payload)
                toast.success('Restaurant updated!')
            } else {
                await restaurantAPI.create(payload)
                toast.success('Restaurant added with Owner account!')
            }
            fetchRestaurants()
            setShowModal(false)
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Failed to save restaurant')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will delete the restaurant and its data.')) return
        try {
            await restaurantAPI.delete(id)
            setRestaurantList(prev => prev.filter(r => r._id !== id))
            toast.success('Restaurant deleted!')
        } catch (error) {
            toast.error('Failed to delete restaurant')
        }
    }

    const toggleStatus = async (id, field, currentValue) => {
        // Optimization: Optimistic update could be added here
        try {
            await restaurantAPI.update(id, { [field]: !currentValue })
            fetchRestaurants()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <BackButton />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Restaurants
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Manage your restaurant partners
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-glow btn-press"
                    >
                        <FiPlus />
                        Add Restaurant
                    </button>
                </motion.div>

                {/* Search */}
                <div className="relative mb-6">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border focus:border-primary-500 transition-all dark:text-white"
                    />
                </div>

                {/* Restaurant Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-surface">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Restaurant
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Cuisine
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Late Night
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                {filteredRestaurants.map((restaurant) => (
                                    <tr key={restaurant._id} className="hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                />
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{restaurant.name}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <FiMapPin size={12} />
                                                        {restaurant.address?.street || restaurant.address || 'No Address'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(restaurant.cuisine || []).slice(0, 2).map(c => (
                                                    <span key={c} className="px-2 py-0.5 bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <FiStar className="text-yellow-500 fill-yellow-500" size={14} />
                                                <span className="font-medium text-gray-900 dark:text-white">{restaurant.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(restaurant._id, 'isOpen', restaurant.isOpen)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${restaurant.isOpen
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                            >
                                                {restaurant.isOpen ? 'Open' : 'Closed'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                /* Late Night not implemented in backend yet, just visual */
                                                className={`w-5 h-5 rounded flex items-center justify-center ${restaurant.lateNight
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-gray-200 dark:bg-dark-surface'
                                                    }`}
                                            >
                                                {restaurant.lateNight && <FiCheck size={12} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(restaurant)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <FiEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(restaurant._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-lg bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 h-[80vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg"
                                    >
                                        <FiX className="text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Owner Details Section - Only show when adding new */}
                                    {!editingRestaurant && (
                                        <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl space-y-3 mb-4">
                                            <h3 className="font-semibold text-rose-700 dark:text-rose-400">Owner Details</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.ownerName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Login ID)</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                                    placeholder="owner@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                                    placeholder="******"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                                <input
                                                    type="text"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                                    placeholder="+91 9876543210"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="font-semibold text-gray-900 dark:text-white">Restaurant Details</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuisine (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.cuisine}
                                            onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                max="5"
                                                value={formData.rating}
                                                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Time</label>
                                            <input
                                                type="text"
                                                placeholder="25-30 min"
                                                value={formData.deliveryTime}
                                                onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isOpen}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isOpen: e.target.checked }))}
                                                className="w-4 h-4 rounded text-primary-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Currently Open</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-2.5 bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-2.5 gradient-bg text-white rounded-xl font-medium"
                                    >
                                        {editingRestaurant ? 'Save Changes' : 'Add Restaurant'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
