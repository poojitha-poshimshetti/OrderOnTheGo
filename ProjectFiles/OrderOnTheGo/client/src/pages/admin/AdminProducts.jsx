import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productAPI, restaurantAPI } from '../../services/api'
import {
    FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiStar, FiCheck
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import BackButton from '../../components/common/BackButton'

export default function AdminProducts() {
    const [productList, setProductList] = useState([])
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterRestaurant, setFilterRestaurant] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        isVeg: true,
        isBestseller: false,
        restaurantId: ''
    })

    // Fetch products and restaurants from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, restaurantsData] = await Promise.all([
                    productAPI.getAll(),
                    restaurantAPI.getAll()
                ])
                setProductList(productsData.map(p => ({ ...p, id: p._id })))
                setRestaurants(restaurantsData.map(r => ({ ...r, id: r._id })))
            } catch (error) {
                console.error('Failed to fetch data:', error)
                toast.error('Failed to load data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredProducts = productList.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRestaurant = filterRestaurant === 'all' || 
            p.restaurantId === filterRestaurant || 
            p.restaurant?._id === filterRestaurant ||
            p.restaurant === filterRestaurant
        return matchesSearch && matchesRestaurant
    })

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                isVeg: product.isVeg,
                isBestseller: product.isBestseller,
                restaurantId: product.restaurantId
            })
        } else {
            setEditingProduct(null)
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                isVeg: true,
                isBestseller: false,
                restaurantId: 1
            })
        }
        setShowModal(true)
    }

    const handleSave = async () => {
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                restaurant: formData.restaurantId,
                image: formData.image || 'https://cdn-icons-png.flaticon.com/512/1147/1147831.png'
            }

            if (editingProduct) {
                await productAPI.update(editingProduct.id, productData)
                setProductList(prev => prev.map(p =>
                    p.id === editingProduct.id
                        ? { ...p, ...formData, price: parseFloat(formData.price) }
                        : p
                ))
                toast.success('Product updated!')
            } else {
                const newProduct = await productAPI.create(productData)
                setProductList(prev => [...prev, { ...newProduct, id: newProduct._id }])
                toast.success('Product added!')
            }
            setShowModal(false)
        } catch (error) {
            console.error('Failed to save product:', error)
            toast.error('Failed to save product')
        }
    }

    const handleDelete = async (id) => {
        try {
            await productAPI.delete(id)
            setProductList(prev => prev.filter(p => p.id !== id))
            toast.success('Product deleted!')
        } catch (error) {
            console.error('Failed to delete product:', error)
            toast.error('Failed to delete product')
        }
    }

    const toggleField = (id, field) => {
        setProductList(prev => prev.map(p =>
            p.id === id ? { ...p, [field]: !p[field] } : p
        ))
    }

    const getRestaurantName = (id) => {
        const restaurant = restaurants.find(r => r.id === id || r._id === id)
        return restaurant?.name || 'Unknown'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl">🍽️</motion.div>
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <BackButton />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Products
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Manage menu items across all restaurants
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-glow btn-press"
                    >
                        <FiPlus />
                        Add Product
                    </button>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border focus:border-primary-500 transition-all dark:text-white"
                        />
                    </div>
                    <select
                        value={filterRestaurant}
                        onChange={(e) => setFilterRestaurant(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border dark:text-white"
                    >
                        <option value="all">All Restaurants</option>
                        {restaurants.map(r => (
                            <option key={r.id || r._id} value={r.id || r._id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden"
                        >
                            <div className="relative h-40">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 flex gap-2">
                                    <span className={`w-5 h-5 border-2 rounded flex items-center justify-center ${product.isVeg ? 'border-green-500' : 'border-red-500'
                                        }`}>
                                        <span className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                    </span>
                                    {product.isBestseller && (
                                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded-full">
                                            ⭐ Best
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold text-lg text-primary-500">₹{product.price}</span>
                                    <div className="flex items-center gap-1">
                                        <FiStar className="text-yellow-500 fill-yellow-500" size={12} />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{getRestaurantName(product.restaurantId)}</p>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <FiEdit size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <FiTrash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

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
                                className="w-full max-w-lg bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {editingProduct ? 'Edit Product' : 'Add Product'}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg"
                                    >
                                        <FiX className="text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <textarea
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                            <input
                                                type="text"
                                                value={formData.category}
                                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant</label>
                                        <select
                                            value={formData.restaurantId}
                                            onChange={(e) => setFormData(prev => ({ ...prev, restaurantId: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border dark:text-white"
                                        >
                                            <option value="">Select Restaurant</option>
                                            {restaurants.map(r => (
                                                <option key={r.id || r._id} value={r.id || r._id}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isVeg}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isVeg: e.target.checked }))}
                                                className="w-4 h-4 rounded text-green-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Vegetarian</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isBestseller}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isBestseller: e.target.checked }))}
                                                className="w-4 h-4 rounded text-yellow-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Bestseller</span>
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
                                        {editingProduct ? 'Save Changes' : 'Add Product'}
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
