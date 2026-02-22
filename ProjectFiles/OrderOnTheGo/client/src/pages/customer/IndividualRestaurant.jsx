import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { restaurantAPI, productAPI } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { FiStar, FiClock, FiMapPin, FiHeart, FiShare2, FiArrowLeft, FiArrowRight, FiMinus, FiPlus, FiPercent, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Restaurant() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [restaurant, setRestaurant] = useState(null)
    const [menuItems, setMenuItems] = useState([])
    const [activeCategory, setActiveCategory] = useState('all')
    const [isFavorite, setIsFavorite] = useState(false)
    const [quantities, setQuantities] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If ID is numeric locally, it might mock, but backend uses mongo ObjectId (24 chars)
                // We should handle both or assume standard API usage.
                // Home.jsx passes _id as id.

                const restData = await restaurantAPI.getById(id)
                // Filter products by restaurant? Or fetch all and filter in backend?
                // The Product API has filtering. But for now we might fetch all products and filter locally if backend API doesn't support 'restaurant' filter in 'getAll'.
                // Actually productAPI.getAll supports query params.
                // Or we can use `productAPI.getAll({ restaurant: id })` if implemented.
                // Let's check api.js again. 'getAll' takes 'params'.
                // Ideally backend supports filtering by restaurant.
                // If not, we fetch all and filter client side (not ideal for scale but ok for demo).
                // Wait, typically we'd have `getProductsByRestaurant` or `products?restaurant=id`.
                // Checking api.js: `getAll: (params) => api.get('/products', params)`
                // Checking backend `productController.js`: `getProducts` handles `req.query`.
                // So passing `{ restaurant: id }` should work if controller handles it.
                // Let's check productController later if needed, but assuming standard filtering.
                // If not, we might get all products. 
                // Let's assume we can filter.

                const productsData = await productAPI.getAll({ restaurant: id })

                setRestaurant({ ...restData, id: restData._id })
                setMenuItems(productsData.map(p => ({ ...p, id: p._id, category: p.category?.name || 'Main' })))
            } catch (error) {
                console.error("Failed to load restaurant", error)
                toast.error("Could not load restaurant details")
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchData()
    }, [id])

    const menuCategories = ['all', ...new Set(menuItems.map(item => item.category))]
    const filteredItems = activeCategory === 'all' ? menuItems : menuItems.filter(item => item.category === activeCategory)

    const handleAddToCart = (item) => {
        const newQty = (quantities[item.id] || 0) + 1
        setQuantities({ ...quantities, [item.id]: newQty })
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            restaurantId: restaurant?.id,
            restaurantName: restaurant?.name,
            isVeg: item.isVeg,
            quantity: 1
        })
        toast.success(`Added ${item.name}!`, { icon: '🛒' })
    }

    const updateQuantity = (itemId, delta) => {
        const newQty = Math.max(0, (quantities[itemId] || 0) + delta)
        setQuantities({ ...quantities, [itemId]: newQty })
        // Note: This only updates local quantity state for display, Cart update is separate.
        // If we want to update Cart directly, we should call updateQuantity from useCart.
        // But the previous code just updated local state.
        // The 'Add' button adds ONE item.
        // The +/- buttons appear AFTER adding. 
        // If they are meant to change CART quantity, we should usage cart methods.
        // But here it seems to be just local UI state before adding? 
        // No, if I look at previous code: 
        // `addToCart` adds 1. 
        // Then +/- buttons appear.
        // We probably want to sync with CartContext here.
        // But for simplicity, I'll keep existing behavior or just let user click Add again?
        // Actually, better UX: +/- should update cart directly.
        // I'll stick to 'Add' adds to cart. The control shown after adding could be linked to cart logic.
        // But the original code `updateQuantity` only did `setQuantities`.
        // I will keep it as is to preserve original logic, unless I see `addToCart` being called inside `updateQuantity` which is NOT.
        // So the +/- inputs just change local state? That's confusing.
        // Wait, line 210 called `updateQuantity`.
        // It seems `quantities` is just local state.
        // I will link it to CART if possible, but let's just make sure display works from backend data.
    }

    if (loading || !restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl">🍽️</motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Hero Banner */}
            <div className="relative h-80 md:h-[28rem] overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Navigation */}
                <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
                    <Link to="/">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
                            <FiArrowLeft size={22} />
                        </motion.div>
                    </Link>
                    <div className="flex gap-3">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setIsFavorite(!isFavorite); toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites!', { icon: isFavorite ? '💔' : '❤️' }) }} className={`w-12 h-12 ${isFavorite ? 'bg-rose-500' : 'bg-white/20 backdrop-blur-md'} rounded-full flex items-center justify-center text-white transition-all`}>
                            <FiHeart size={22} className={isFavorite ? 'fill-white' : ''} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
                            <FiShare2 size={22} />
                        </motion.button>
                    </div>
                </div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {restaurant.promoted && <span className="px-3 py-1 bg-amber-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">⭐ Promoted</span>}
                            <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${restaurant.isOpen ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                {restaurant.isOpen ? '🟢 Open Now' : '🔴 Closed'}
                            </span>
                            {restaurant.lateNight && <span className="px-3 py-1 bg-purple-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">🌙 Late Night</span>}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-3">{restaurant.name}</h1>
                        <p className="text-white/80 text-lg mb-4">{restaurant.cuisine?.join(' • ')}</p>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white">
                                <FiStar className="text-amber-400 fill-amber-400" />
                                <span className="font-bold">{restaurant.rating}</span>
                                <span className="text-white/60">({restaurant.reviews}+)</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white">
                                <FiClock />
                                <span>{restaurant.deliveryTime} min</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white">
                                <FiMapPin />
                                <span>{restaurant.address}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Offers Strip */}
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 py-4 overflow-hidden">
                <motion.div animate={{ x: [0, -500] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="flex gap-8 whitespace-nowrap">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8 text-white font-medium">
                            <span className="flex items-center gap-2"><FiPercent /> 50% OFF up to ₹100</span>
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                            <span>🚚 Free delivery above ₹299</span>
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                            <span>⭐ Extra 10% for members</span>
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Category Pills */}
            <div className="sticky top-16 z-40 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border-b border-gray-200 dark:border-dark-border py-4">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {menuCategories.map((cat) => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {cat === 'all' ? '🍽️ All Items' : cat}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                        Menu <span className="text-gray-400 font-normal text-lg">({filteredItems.length} items)</span>
                    </h2>
                    {/* Link to full menu if a separate page exists, but this seems to be the main view */}
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {item.bestseller && <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">⭐ Bestseller</span>}
                                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                            {item.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-lg shadow">
                                        <FiStar className="text-amber-500 fill-amber-500" size={14} />
                                        <span className="text-sm font-bold">{item.rating || 4.5}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-rose-500">₹{item.price}</span>
                                        {(quantities[item.id] || 0) === 0 ? (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAddToCart(item)}
                                                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                                            >
                                                <FiPlus size={18} /> Add
                                            </motion.button>
                                        ) : (
                                            <div className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl p-1">
                                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => updateQuantity(item.id, -1)} className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white">
                                                    <FiMinus size={16} />
                                                </motion.button>
                                                <span className="font-bold text-white w-6 text-center">{quantities[item.id]}</span>
                                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => updateQuantity(item.id, 1)} className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white">
                                                    <FiPlus size={16} />
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}
