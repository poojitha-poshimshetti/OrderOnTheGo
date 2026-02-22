import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { productAPI, categoryAPI, restaurantAPI } from '../../services/api'
import { FiSearch, FiStar, FiClock, FiMapPin, FiHeart, FiMinus, FiPlus, FiX, FiFilter, FiGrid, FiList, FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import BackButton from '../../components/common/BackButton'
import toast from 'react-hot-toast'

// 3D Tilt Card
const TiltCard = ({ children, className }) => {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [5, -5])
    const rotateY = useTransform(x, [-100, 100], [-5, 5])

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={(e) => {
                const rect = ref.current?.getBoundingClientRect()
                if (!rect) return
                x.set(e.clientX - rect.left - rect.width / 2)
                y.set(e.clientY - rect.top - rect.height / 2)
            }}
            onMouseLeave={() => { x.set(0); y.set(0) }}
            className={className}
        >{children}</motion.div>
    )
}

// Product Card
const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(0)

    const handleAdd = () => {
        setQuantity(1)
        onAddToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            restaurantId: product.restaurant?._id || product.restaurant,
            restaurantName: product.restaurant?.name || 'Unknown',
            isVeg: product.isVeg,
            quantity: 1
        })
        toast.success(`Added ${product.name}!`, { icon: '🛒' })
    }

    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="group">
            <TiltCard className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow h-full">
                <div className="relative h-44 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.bestseller && <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">⭐ Bestseller</span>}
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${product.isVeg ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {product.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
                        </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-lg">
                        <FiStar className="text-amber-500 fill-amber-500" size={14} />
                        <span className="text-sm font-bold">{product.rating || 4.5}</span>
                    </div>
                </div>
                <div className="p-4">
                    <Link to={`/restaurant/${product.restaurant?._id || product.restaurant}`} className="text-xs text-rose-500 font-semibold hover:underline">{product.restaurant?.name || 'View Restaurant'}</Link>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-rose-500">₹{product.price}</span>
                        {quantity === 0 ? (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAdd} className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl text-sm">Add</motion.button>
                        ) : (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl p-1">
                                <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white"><FiMinus size={14} /></button>
                                <span className="font-bold text-white w-5 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white"><FiPlus size={14} /></button>
                            </div>
                        )}
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    )
}

// Restaurant Card
const RestaurantMiniCard = ({ restaurant }) => (
    <Link to={`/restaurant/${restaurant._id}`}>
        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <div className="relative h-32 overflow-hidden">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-white text-lg">{restaurant.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <FiStar className="text-amber-400 fill-amber-400" size={14} />
                        <span>{restaurant.rating || 4.5}</span>
                        <span>•</span>
                        <span>{restaurant.deliveryTime || '30-40 min'}</span>
                    </div>
                    {restaurant.cuisine && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {restaurant.cuisine.slice(0, 2).map((c, i) => (
                                <span key={i} className="text-xs text-white/70 bg-white/20 px-2 py-0.5 rounded-full">{c}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    </Link>
)

export default function Search() {
    const { addToCart } = useCart()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const categoryParam = searchParams.get('category')
    const cuisineParam = searchParams.get('cuisine')
    const queryParam = searchParams.get('q')
    const tabParam = searchParams.get('tab')

    const [searchQuery, setSearchQuery] = useState(queryParam || '')
    const [activeTab, setActiveTab] = useState(tabParam || (cuisineParam ? 'restaurants' : 'all')) // 'all', 'restaurants', 'dishes'
    const [activeCategory, setActiveCategory] = useState(categoryParam || 'all')
    const [activeCuisine, setActiveCuisine] = useState(cuisineParam || '')
    const [showVegOnly, setShowVegOnly] = useState(false)
    const [viewMode, setViewMode] = useState('grid')
    const [sortBy, setSortBy] = useState('popular')
    const [showFilters, setShowFilters] = useState(false)

    // Data States
    const [allProducts, setAllProducts] = useState([])
    const [allRestaurants, setAllRestaurants] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [loading, setLoading] = useState(true)

    const inputRef = useRef(null)

    useEffect(() => {
        if (!queryParam) inputRef.current?.focus()
        fetchData()
    }, [activeCuisine])

    useEffect(() => {
        if (categoryParam) setActiveCategory(categoryParam)
        if (cuisineParam) setActiveCuisine(cuisineParam)
        if (queryParam) setSearchQuery(queryParam)
        if (tabParam) setActiveTab(tabParam)
    }, [categoryParam, cuisineParam, queryParam, tabParam])

    const fetchData = async () => {
        try {
            // Fetch restaurants with cuisine filter if active
            const restaurantParams = activeCuisine ? { cuisine: activeCuisine } : {}
            const [productsData, restaurantsData, categoriesData] = await Promise.all([
                productAPI.getAll(),
                restaurantAPI.getAll(restaurantParams),
                categoryAPI.getAll()
            ])
            console.log('Fetched products:', productsData.length)
            console.log('Sample product category:', productsData[0]?.category)
            setAllProducts(productsData)
            setAllRestaurants(restaurantsData)
            setAllCategories(['all', ...categoriesData.map(c => c.name)])
        } catch (error) {
            console.error('Failed to fetch search data', error)
            toast.error('Failed to load search data')
        } finally {
            setLoading(false)
        }
    }

    const trendingSearches = ['Pizza', 'Biryani', 'Burger', 'Chinese', 'Dosa', 'Sushi']

    const filteredProducts = allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            p.restaurant?.cuisine?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))

        // Check category match - handle both populated and non-populated category
        const productCategoryName = p.category?.name || p.categoryName || ''
        const matchesCategory = activeCategory === 'all' ||
            productCategoryName === activeCategory ||
            p.category?._id === activeCategory ||
            p.category === activeCategory

        const matchesVeg = !showVegOnly || p.isVeg
        return matchesSearch && matchesCategory && matchesVeg
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
        return (b.reviews || 0) - (a.reviews || 0)
    })

    const filteredRestaurants = allRestaurants.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleAddToCart = (item) => {
        addToCart({
            id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            restaurantId: item.restaurant?._id || item.restaurant,
            restaurantName: item.restaurant?.name || 'Unknown',
            isVeg: item.isVeg,
            quantity: 1
        })
        toast.success(`Added ${item.name}!`, { icon: '🛒' })
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Hero Search */}
            <div className="relative bg-gradient-to-br from-rose-600 via-purple-600 to-cyan-600 py-16 overflow-hidden">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="mb-6">
                        <BackButton />
                    </div>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white text-center mb-8">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">Favorite</span> Food
                    </motion.h1>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                        <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-xl" />
                        <div className="relative flex items-center gap-4 px-6 py-4 bg-white dark:bg-dark-card rounded-2xl shadow-2xl">
                            <FiSearch size={24} className="text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search for dishes, restaurants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                            />
                            {searchQuery && (
                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                                    <FiX size={20} />
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Trending */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        <span className="text-white/80 text-sm flex items-center gap-1"><FiTrendingUp /> Trending:</span>
                        {trendingSearches.map((term, idx) => (
                            <motion.button
                                key={term}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + idx * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSearchQuery(term)}
                                className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                            >
                                {term}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-16 z-40 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
                        {/* Tabs */}
                        <div className="flex gap-2">
                            {[{ id: 'all', label: 'All' }, { id: 'dishes', label: 'Dishes' }, { id: 'restaurants', label: 'Restaurants' }].map(tab => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'}`}
                                >
                                    {tab.label}
                                </motion.button>
                            ))}
                        </div>

                        <div className="w-px h-8 bg-gray-200 dark:bg-dark-border" />

                        {/* Veg Filter */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setShowVegOnly(!showVegOnly)}
                            className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap ${showVegOnly ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'}`}
                        >
                            🌱 Veg Only
                        </motion.button>

                        {/* View Mode */}
                        <div className="flex gap-1 bg-gray-100 dark:bg-dark-card rounded-xl p-1 ml-auto">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-dark-border shadow' : ''}`}><FiGrid size={18} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-dark-border shadow' : ''}`}><FiList size={18} /></button>
                        </div>
                    </div>

                    {/* Category Pills */}
                    {(activeTab === 'all' || activeTab === 'dishes') && (
                        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
                            {allCategories.slice(0, 12).map((cat) => (
                                <motion.button
                                    key={cat}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap text-sm ${activeCategory === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400'}`}
                                >
                                    {cat === 'all' ? '🍽️ All' : cat}
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Cuisine Filter Header */}
                {activeCuisine && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                                {activeCuisine} Restaurants
                            </h2>
                            <button 
                                onClick={() => { setActiveCuisine(''); navigate('/search') }}
                                className="px-3 py-1 bg-gray-200 dark:bg-dark-card rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                                Clear Filter ✕
                            </button>
                        </div>
                        <p className="text-gray-500 mt-2">Showing restaurants that serve {activeCuisine}</p>
                    </motion.div>
                )}

                {/* Restaurants Section */}
                {(activeTab === 'all' || activeTab === 'restaurants') && filteredRestaurants.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                {activeCuisine ? `${activeCuisine} Restaurants` : 'Restaurants'} 
                                <span className="text-gray-400 font-normal text-lg">({filteredRestaurants.length})</span>
                            </h2>
                            {activeTab === 'all' && <Link to="/search?tab=restaurants" className="text-rose-500 font-semibold flex items-center gap-1">View All <FiArrowRight /></Link>}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {filteredRestaurants.slice(0, activeTab === 'all' ? 6 : undefined).map((restaurant) => (
                                <RestaurantMiniCard key={restaurant._id} restaurant={restaurant} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Dishes Section */}
                {(activeTab === 'all' || activeTab === 'dishes') && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                Dishes <span className="text-gray-400 font-normal text-lg">({filteredProducts.length})</span>
                            </h2>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-4">🔍</motion.div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No dishes found</h3>
                                <p className="text-gray-500">Try a different search term</p>
                            </motion.div>
                        ) : (
                            <motion.div layout className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                                <AnimatePresence>
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </section>
                )}
            </div>
        </div>
    )
}
